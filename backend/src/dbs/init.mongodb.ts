import mongoose from "mongoose";
import { MongoDBConfig } from "../configs/app.config";
// import logging from "../configs/logging.config";

export class InitMongoDB {
    static async connect() {
        try {
            await mongoose.connect(MongoDBConfig.MONGODB_URI)
            console.log(`Connected to MongoDB`)
        } catch (error: any) {
            console.log(error.message)
        }
    }
}