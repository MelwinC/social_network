import { Server } from "socket.io";

class WebSocketServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
      },
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      // Verify token here
      next();
    });

    this.io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("joinRoom", (conversationId) => {
        socket.join(conversationId);
      });

      socket.on("leaveRoom", (conversationId) => {
        socket.leave(conversationId);
      });

      socket.on("message", (message) => {
        this.io.to(message.conversationId).emit("message", message);
      });

      socket.on("typing", (data) => {
        this.io.to(data.conversationId).emit("typing", data);
      });

      socket.on("stopTyping", (data) => {
        this.io.to(data.conversationId).emit("stopTyping", data);
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
  }

  emitMessage(conversationId, message) {
    this.io.to(conversationId).emit("message", message);
  }
}

export default WebSocketServer;