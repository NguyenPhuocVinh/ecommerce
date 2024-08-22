import { OtpModel } from "../models/email/otp.model";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { generateOTP } from "../utils/otp.util";

// const OtpSchema = new mongoose.Schema<OTPDocument>({
//     otp: { type: String, required: true },
//     email: { type: String, required: true },
//     status: { type: Boolean, default: false },
//     expired_at: { type: Date, expires: 60, default: Date.now }
// }, { timestamps: true });

export class OtpService {
    static async createOtp(email: string) {
        try {
            const randomOtp = await generateOTP();
            const otpExist = await OtpModel.findOne({ email });
            if (otpExist) {
                await OtpModel.findOneAndUpdate({ email }, { otp: randomOtp }, { new: true });
                return randomOtp;
            }
            await OtpModel.create({
                otp: randomOtp,
                email
            })
            return randomOtp;
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    static async verifyOtp({ email, otp }: { email: string, otp: string }) {
        try {
            const otpData = await OtpModel.findOne({ email, otp });
            if (!otpData) {
                throw new AppError(StatusCodes.NOT_FOUND, "OTP is expired");
            }

            await OtpModel.findOneAndDelete({ email, otp });
            return true;
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}