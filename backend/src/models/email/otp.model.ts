import mongoose from "mongoose";
import { IOtp } from "../../types/auth.type";

export interface OTPDocument extends IOtp, mongoose.Document { }

const OtpSchema = new mongoose.Schema<OTPDocument>({
    otp: { type: String, required: true },
    email: { type: String, required: true },
    expired_at: { type: Date, expires: 300, default: Date.now }
}, { timestamps: true });

export const OtpModel = mongoose.model<OTPDocument>('Otp', OtpSchema);