import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import ordersRouter from "./controllers/orders";
import printRouter from "./controllers/print";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/v1/orders", ordersRouter);
app.use("/v1/print", printRouter);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
globalThis.io = io;

io.on("connection", (socket) => console.log("ws connected", socket.id));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend listening ${PORT}`));

