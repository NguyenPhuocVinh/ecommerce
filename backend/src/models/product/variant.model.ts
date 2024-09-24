import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface IVariant {
    productId: any
    image: string[]
    price: number
    stock: number
    // attributes: {
    //     attributeName: string;
    //     value: Types.ObjectId;
    // }[];
    attributes: {
        value: Types.ObjectId
    }[];
    isPublish: boolean
}

export interface VariantDocument extends IVariant, Document { }

const VariantSchema = new Schema<VariantDocument>({
    productId: { type: String, required: true },
    image: [{ type: String, default: '' }],
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    attributes: [
        {
            value: { type: Types.ObjectId, ref: 'Attribute' }
        }
    ],
    isPublish: { type: Boolean, default: false }
}, { timestamps: true })

VariantSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.attributes.forEach((attr: { _id: any; }) => {
            delete attr._id;
        });
        return ret;
    }
});

export const VariantModel = model<VariantDocument>('Variant', VariantSchema)