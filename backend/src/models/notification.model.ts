import mongoose, { Document, Schema } from "mongoose";
import { INotification, NOTIFICATION_TYPE } from "../types/notification.type";

export interface NotificationDocument extends INotification, Document {
    _id: mongoose.Types.ObjectId;
};


// export interface INotification {
//     _id?: any
//     type: NOTIFICATION_TYPE
//     sender: any
//     receiver: any
//     content: string
//     options: object
// }
const NotificationSchema = new Schema<NotificationDocument>({
    type: { type: String, enum: Object.values(NOTIFICATION_TYPE), required: true },
    sender: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    options: { type: Object, default: {} }
}, { timestamps: true });

export const NotificationModel = mongoose.model<NotificationDocument>('Notification', NotificationSchema);
