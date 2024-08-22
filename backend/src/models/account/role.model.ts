import mongoose, { Document, model, Schema, Types } from "mongoose";
import { IRole } from "../../types/role.type";
import { ROLE_NAME, ROLE_STATUS } from "../../libs/contants/role";
export interface RoleDocument extends IRole, Document { };

const RoleSchema = new Schema<RoleDocument>({
    rol_name: { type: String, required: true, enum: Object.values(ROLE_NAME) },
    rol_slug: { type: String, required: true },
    rol_status: { type: String, default: ROLE_STATUS.ACTIVE, enum: Object.values(ROLE_STATUS) },
    rol_description: { type: String, required: true },
    rol_grants: [{
        resource: { type: Types.ObjectId, ref: 'Resource', required: true },
        action: [{ type: String, required: true }],
        attributes: { type: String, default: '*' }
    }]
}, { timestamps: true })

export const RoleModel = model<RoleDocument>('Role', RoleSchema)