import { setGlobalOptions } from "firebase-functions/v2";
import { onInit } from "firebase-functions/v2/core";

// Performance Optimization: Increase concurrency to handle load spikes
// efficiently. Higher concurrency limits the number of cold starts by
// reusing instances for multiple requests.
setGlobalOptions({
  maxInstances: 10,
  concurrency: 80,
});

onInit(async () => {
  // Add any heavy backend initialization here if needed in the future
  console.log("Backend initialization complete.");
});

// export const helloWorld = onRequest((request, response) => {
//   response.send("Hello from Backend!");
// });
