let ioInstance = null;

export const initRealtime = (io) => {
  ioInstance = io;
  io.on("connection", (socket) => {
    console.log(`Client connected to WebSocket: ${socket.id}`);
    socket.on("disconnect", () => {
      console.log(`Client disconnected from WebSocket: ${socket.id}`);
    });
  });
};

export const triggerUpdate = (collectionName) => {
  if (ioInstance) {
    console.log(`Broadcasting update for collection: ${collectionName}`);
    ioInstance.emit(`${collectionName}_changed`);
  }
};
