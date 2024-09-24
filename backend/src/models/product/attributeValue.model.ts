import mongoose, { Document, model, Schema } from "mongoose";

export interface IAttributeValue {
    name: string
    value: string | number
}

export interface AttributeValueDocument extends IAttributeValue, Document { }

const AttributeValueSchema = new Schema<AttributeValueDocument>({
    name: { type: String, required: true },
    value: { type: String, required: true }
}, { timestamps: true })

export const AttributeValueModel = model<AttributeValueDocument>('AttributeValue', AttributeValueSchema)