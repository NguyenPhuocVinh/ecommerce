import mongoose, { Document, model, Schema, Types } from "mongoose";
import { IUser } from "../../types/auth.type";
import { ROLE_STATUS } from "../../libs/contants/role";
// export interface IUser {
//     // _id?: any,
//     slug: string,
//     name: string,
//     password: string,
//     email: string,
//     phone: string
//     sex: string,
//     avatar: string,
//     date_of_birth: Date,
//     role: string,
//     status: string
// }
export interface UserDocument extends IUser, Document { };
const UserSchema = new Schema<UserDocument>({
    slug: { type: String, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    sex: { type: String },
    avatar: { type: String, default: '' },
    date_of_birth: { type: Date, default: null },
    role: { type: Types.ObjectId, ref: 'Role' },
    status: { type: String, default: ROLE_STATUS.PENDING, enum: Object.values(ROLE_STATUS) }
}, { timestamps: true })

export const UserModel = model<UserDocument>('User', UserSchema)