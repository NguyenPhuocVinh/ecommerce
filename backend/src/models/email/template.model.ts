import mongoose from "mongoose";
import { ITemplate } from "../../types/auth.type";
import { TEMPLATE_STATUS } from "../../libs/contants/template";

export interface TemplateDocument extends ITemplate, mongoose.Document { };

const TemplateSchema = new mongoose.Schema<TemplateDocument>({
    templateId: { type: Number, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: Object.values(TEMPLATE_STATUS), default: TEMPLATE_STATUS.ACTIVE },
    html: { type: String, required: true }
}, { timestamps: true })

export const TemplateModel = mongoose.model<TemplateDocument>('Template', TemplateSchema)