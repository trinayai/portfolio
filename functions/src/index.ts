import { genkit, z } from "genkit";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import { googleAI } from "@genkit-ai/googleai";
import { onCallGenkit } from "firebase-functions/https";
import { setGlobalOptions } from "firebase-functions/v2";

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
