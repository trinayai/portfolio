import {onRequest} from "firebase-functions/https";

export const helloBackendGenkit = onRequest((request, response) => {
  response.status(200).send("Backend Genkit sample is ready.");
});
