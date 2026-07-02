import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initializeStorage } from "./services/storageService.js";
import { initializeBroker } from "./utils/eventQueue.js";
import { startCrashRecovery } from "./services/crashRecovery.js";
import { runSaga } from "./services/sagaEngine.js";

// Validate critical environment variables
if (!process.env.JWT_SECRET) {
  console.error("CRITICAL: JWT_SECRET environment variable is missing in server/.env.");
  process.exit(1);
}

// Connect Database & Initialize Storage
const startServer = async () => {
  try {
    await connectDB();
    await initializeStorage();

    // Initialize Event-Driven Broker & Queues
    // Listen to background payments success to run Saga coordinator
    initializeBroker({
      PAYMENT_SUCCESS: async (event) => {
        try {
          await runSaga(event.id);
        } catch (err) {
          console.error(`[Event Consumer] Saga run failed for event ${event.id}:`, err.message);
        }
      },
    });

    // Start transaction crash recovery background loops
    startCrashRecovery();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
      );
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
// Trigger reload 3
