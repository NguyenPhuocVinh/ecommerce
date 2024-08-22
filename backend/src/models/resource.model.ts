import mongoose, { Document, model, Schema } from "mongoose";
import { IResource } from "../types/role.type";

export interface ResourceDocument extends IResource, Document { };

const ResourceSchema = new Schema<ResourceDocument>({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, default: '' }
}, { timestamps: true })

export const ResourceModel = model<ResourceDocument>('Resource', ResourceSchema);