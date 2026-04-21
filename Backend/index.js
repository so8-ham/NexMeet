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
        const connectionDB = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connecting Successfully...")
    } catch (err) {
        console.log(`error is=${err}`);
    }
    server.listen(app.get("port"), () => {
        console.log("Listning on port on 8000");
    });
}

start();