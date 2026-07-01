import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();
let bullQueue = null;
let bullWorker = null;
let useRedis = false;

// Event Definitions
export const EVENTS = {
  PAYMENT_INITIATED: "PAYMENT_INITIATED",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  DONATION_CREATED: "DONATION_CREATED",
  EMAIL_SENT: "EMAIL_SENT",
  NOTIFICATION_SENT: "NOTIFICATION_SENT",
  REFUND_CREATED: "REFUND_CREATED",
};

/**
 * Initializes the queue broker. 
 * Checks for REDIS_URL or REDIS_HOST in environment variables.
 */
export function initializeBroker(processorMap = {}) {
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST;
  
  if (redisUrl) {
    try {
      console.log("🚀 Initializing BullMQ with Redis connection...");
      const connection = new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
      });

      bullQueue = new Queue("payment-events-queue", { connection });
      useRedis = true;

      // Register the worker
      bullWorker = new Worker(
        "payment-events-queue",
        async (job) => {
          const { eventName, data } = job.data;
          console.log(`[Queue Worker] Processing job ${job.id} for event ${eventName}`);
          
          if (processorMap[eventName]) {
            await processorMap[eventName](data);
          } else {
            // Fallback to event emitter handlers registered in process memory
            const listeners = eventEmitter.listeners(eventName);
            for (const listener of listeners) {
              await listener(data);
            }
          }
        },
        { connection }
      );

      bullWorker.on("completed", (job) => {
        console.log(`[Queue Worker] Job ${job.id} completed successfully`);
      });

      bullWorker.on("failed", (job, err) => {
        console.error(`[Queue Worker] Job ${job?.id} failed:`, err.message);
      });

    } catch (err) {
      console.error("❌ Failed to connect to Redis. Falling back to in-memory Event Broker:", err.message);
      useRedis = false;
    }
  } else {
    console.log("ℹ️ No REDIS_URL or REDIS_HOST found. Operating in-memory Event Broker mode.");
  }

  // If using in-memory, wire up listener mapping
  if (!useRedis) {
    Object.keys(processorMap).forEach((eventName) => {
      eventEmitter.on(eventName, async (data) => {
        try {
          // Process asynchronously to simulate background queue worker
          setImmediate(async () => {
            try {
              await processorMap[eventName](data);
            } catch (err) {
              console.error(`[InMemory Event Broker] Handler failed for ${eventName}:`, err.message);
            }
          });
        } catch (err) {
          console.error(`[InMemory Event Broker] Scheduling failed for ${eventName}:`, err.message);
        }
      });
    });
  }
}

/**
 * Publishes an event to the queue or event emitter.
 * @param {string} eventName - name of the event from EVENTS
 * @param {Object} data - event payload
 */
export async function publishEvent(eventName, data) {
  console.log(`📢 Publishing Event: [${eventName}]`, { idempotencyKey: data?.idempotencyKey || data?.id });

  if (useRedis && bullQueue) {
    await bullQueue.add(
      eventName,
      { eventName, data },
      {
        attempts: 3, // Retry up to 3 times
        backoff: {
          type: "exponential",
          delay: 2000, // Wait 2s, 4s, 8s...
        },
        removeOnComplete: true,
      }
    );
  } else {
    eventEmitter.emit(eventName, data);
  }
}

/**
 * Registers an event handler (useful for non-queue event notifications in memory)
 * @param {string} eventName 
 * @param {Function} handler 
 */
export function registerHandler(eventName, handler) {
  eventEmitter.on(eventName, handler);
}
