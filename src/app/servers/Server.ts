import Application from "../App";

// Set environment variables for error handling and logging
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1); // Exit the process with an error code
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled promise rejection:", reason);
  process.exit(1); // Exit the process with an error code
});

const app = new Application();

(async () => {
  try {
    await app.initialize();
    app.startServer();
  } catch (error) {
    console.error("Failed to initialize app:", error);
    process.exit(1); // Exit if initialization fails
  }
})()
  .then()
  .catch((error) => {
    console.error(error);
  });
