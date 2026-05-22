import express from "express";
import "dotenv/config";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import initilizeSocketIo from "./controllers/socketManager.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const server = createServer(app);
const io = initilizeSocketIo(server);


app.set("port", (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", userRoutes);


const start = async () => {
    try {
        // set a reasonable server selection timeout so failed connections fail fast
        const connectionDB = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Database connected successfully");

        server.listen(app.get("port"), () => {
            console.log(`Listening on port ${app.get("port")}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message || err);
        // If DB connection fails, exit so requests don't queue and time out
        process.exit(1);
    }
};

start();