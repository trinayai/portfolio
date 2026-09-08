import { genkit, z } from "genkit";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import { googleAI } from "@genkit-ai/googleai";
import { onCallGenkit } from "firebase-functions/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";
import nodemailer from "nodemailer";

initializeApp();

// Performance Optimization: Increase concurrency to handle load
// spikes efficiently.
setGlobalOptions({
  maxInstances: 10,
  concurrency: 80,
});

// Initialize Genkit at the top level for deployment discovery.
// We enable telemetry and plugins here.
enableFirebaseTelemetry();
const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: "googleai/gemini-1.5-flash",
});

/**
 * Tamil + English Chatbot Flow
 */
export const chatbotFlow = ai.defineFlow({
  name: "chatbotFlow",
  inputSchema: z.object({
    query: z.string(),
    history: z.array(z.object({
      role: z.enum(["user", "model"]),
      content: z.array(z.object({ text: z.string() })),
    })).optional(),
  }),
  outputSchema: z.string(),
}, async (input) => {
  const response = await ai.generate({
    system: "You are Trinay AI assistant. You speak Tamil and English. " +
            "Help users with their queries about Trinay AI services and " +
            "global needs.",
    messages: input.history || [],
    prompt: input.query,
  });
  return response.text;
});

// Firebase Function to expose the flow
export const chatbot = onCallGenkit(chatbotFlow);

const freeEmailDomains = new Set([
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com",
  "aol.com", "proton.me", "protonmail.com", "mail.com", "yandex.com"
]);

const workEmailPattern = /^[^\s@]+@([^\s@]+\.[^\s@]{2,})$/;

export const sendProjectBrief = onCall({
  region: "asia-south2",
  enforceAppCheck: false,
}, async (request) => {
  const data = request.data as { name?: unknown; email?: unknown; interest?: unknown; message?: unknown };
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const interest = typeof data.interest === "string" ? data.interest.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const domain = email.split("@")[1] || "";

  if (!name || name.length > 120 || !workEmailPattern.test(email) || freeEmailDomains.has(domain) || !interest || !message || message.length > 5000) {
    throw new HttpsError("invalid-argument", "Enter a valid work email and complete project details.");
  }

  const settings = (await getFirestore().doc("siteSettings/main").get()).data() || {};
  const recipient = typeof settings.contactEmail === "string" && settings.contactEmail.includes("@")
    ? settings.contactEmail
    : "admin@trinayai.com";
  const smtpUser = process.env.HOSTINGER_SMTP_USER;
  const smtpPassword = process.env.HOSTINGER_SMTP_PASSWORD;
  const from = process.env.HOSTINGER_SMTP_FROM || smtpUser;

  if (!smtpUser || !smtpPassword || !from) {
    throw new HttpsError("failed-precondition", "Email service is not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: { user: smtpUser, pass: smtpPassword },
  });

  await transporter.sendMail({
    from: `Trinay AI website <${from}>`,
    to: recipient,
    replyTo: email,
    subject: `Project brief: ${interest}`,
    text: [`Name: ${name}`, `Work email: ${email}`, `Interest: ${interest}`, "", message].join("\n"),
  });

  return { sent: true };
});
