// Real-time notifications have been offloaded to client-side Supabase Realtime Channels.
// This file contains placeholder methods for backwards compatibility.

export const initRealtime = (io) => {
  // No-op
};

export const triggerUpdate = (collectionName) => {
  console.log(`Supabase Realtime handles database update event for table: ${collectionName}`);
};
