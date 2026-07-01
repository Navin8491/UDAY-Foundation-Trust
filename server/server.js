import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { initializeStorage } from "./services/storageService.js";
import { initializeBroker } from "./utils/eventQueue.js";
import { startCrashRecovery } from "./services/crashRecovery.js";
import { runSaga } from "./services/sagaEngine.js";

dotenv.config();

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
      }
    });

    // Start transaction crash recovery background loops
    startCrashRecovery();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
