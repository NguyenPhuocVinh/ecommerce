// src/services/user.service.ts
import { UserModel } from "../models/account/user.model";
import { UserRegisterDTO } from "../libs/dto/auth";
import bcrypt from "bcrypt";
import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { RbacService } from "./rbac.service";
import { KeyTokenService } from "./keyToken.service";
import { getInfoData } from "../utils/filter.util";
import { OtpService } from "./otp.service";
import { ROLE_STATUS } from "../libs/contants/role";
import { EmailService } from "./email.service";

export class UserService {
    static async registerUser(userDto: UserRegisterDTO) {
        const { name, password, email, phone } = userDto;

        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser?.status === ROLE_STATUS.PENDING) {
                EmailService.sendOtpEmail(email);
                return {

                    message: "Please check your email for verifying your account",
                    user: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        object: existingUser
                    })
                };
            }
            // Check if user already exists
            if (existingUser && existingUser.status === ROLE_STATUS.ACTIVE) {
                throw new AppError(StatusCodes.CONFLICT, "Email already in use");
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const defaultRole = await RbacService.getRoleUsers();
            const role = defaultRole.find(r => r.role === 'user')?._id;

            if (!role) {
                throw new AppError(StatusCodes.NOT_FOUND, "Default role not found");
            }

            const newUser = await UserModel.create({
                slug: name.toLowerCase().replace(/\s/g, '-'),
                name,
                email,
                password: hashedPassword,
                phone,
                role
            });

            const sendEmail = EmailService.sendOtpEmail(email);
            // Extract user info
            const userInfo = getInfoData({
                fields: ['_id', 'name', 'email'],
                object: newUser
            });

            return {
                message: "Please check your email for verifying your account",
                user: userInfo
            };
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    static async loginUser(body: Pick<UserRegisterDTO, 'email' | 'phone' | 'password'>) {
        try {
            const { email, phone, password } = body;

            // Check if user exists
            const user = await UserModel.findOne({ $or: [{ email }, { phone }] });
            if (!user) {
                throw new AppError(StatusCodes.NOT_FOUND, "User not found");
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new AppError(StatusCodes.BAD_REQUEST, "Invalid password");
            }
            const userInfo = getInfoData({
                fields: ['_id', 'name', 'email'],
                object: user
            });
            const { accessToken, refreshToken } = await KeyTokenService.generateToken(userInfo);
            return {
                user: userInfo,
                tokens: {
                    accessToken,
                    refreshToken
                }
            };
        } catch (error: any) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    static async veryfyUser({ email, otp }: { email: string, otp: string }) {
        try {
            const isVerified = await OtpService.verifyOtp({ email, otp });
            if (!isVerified) {
                throw new AppError(StatusCodes.BAD_REQUEST, "Invalid OTP");
            }
            const user = await UserModel.findOneAndUpdate({ email }, { $set: { status: ROLE_STATUS.ACTIVE } }, { new: true });
            if (!user) {
                throw new AppError(StatusCodes.NOT_FOUND, "User not found");
            }
            return getInfoData({
                fields: ['_id', 'name', 'email'],
                object: user
            });
        } catch (error: any) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}
