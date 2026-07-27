import { onRequest } from "firebase-functions/https";

export const helloGenkit = onRequest((request, response) => {
  response.status(200).send("Genkit sample is ready.");
});
