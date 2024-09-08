import mongoose, { Document, model, Schema } from "mongoose";
import { IAttribute } from "../../types/attributes.type";

export interface AttributeDocument extends IAttribute, Document { }

const AttributeSchema = new Schema<AttributeDocument>({
    name: { type: String, required: true },
    value: [{ type: String, required: true }]
})

export const AttributeModel = model<AttributeDocument>('Attribute', AttributeSchema)