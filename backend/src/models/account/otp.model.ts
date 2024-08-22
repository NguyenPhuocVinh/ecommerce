import mongoose from "mongoose";
import { IOtp } from "../../types/auth.type";

export interface OTPDocument extends IOtp, mongoose.Document { }

const OtpSchema = new mongoose.Schema<OTPDocument>({
    otp: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: Boolean, default: false },
    expired_at: { type: Date, expires: 60, default: Date.now }
}, { timestamps: true });

export const OtpModel = mongoose.model<OTPDocument>('Otp', OtpSchema);