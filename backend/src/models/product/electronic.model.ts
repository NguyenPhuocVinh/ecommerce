import mongoose from "mongoose";
import { IElectronic } from "../../types/product.type";

export interface ElectronicDocument extends IElectronic, mongoose.Document { }

const ElectronicSchema = new mongoose.Schema<ElectronicDocument>({
    manufacturer: { type: String, required: true },
    modelName: { type: String, required: true },
    color: { type: String, required: true },
}, { timestamps: true });

export const ElectronicModel = mongoose.model<ElectronicDocument>("Electronic", ElectronicSchema);