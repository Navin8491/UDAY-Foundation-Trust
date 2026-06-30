import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { initializeStorage } from "./services/storageService.js";

dotenv.config();

// Connect Database & Initialize Storage
const startServer = async () => {
  try {
    await connectDB();
    await initializeStorage();

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
