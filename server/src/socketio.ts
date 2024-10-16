import { Server } from "socket.io";

const SocketIOConnection = new Server(3001, {
    cors: {
        origin: "http://localhost:5173", // React frontend
        methods: ["GET", "POST"]
    }
});

export default SocketIOConnection;