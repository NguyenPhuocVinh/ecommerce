// src/services/user.service.ts
import { UserModel } from "../models/account/user.model";
import { UserRegisterDTO } from "../libs/dto/auth";
import bcrypt from "bcrypt";
import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { RbacService } from "./rbac.service";
import { KeyTokenService } from "./keyToken.service";
import { getInfoData } from "../utils/filter.util";

export class UserService {
    static async registerUser(userDto: UserRegisterDTO) {
        const { name, password, email, phone } = userDto;

        try {
            // Check if user already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                throw new AppError(StatusCodes.CONFLICT, "Email already in use");
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Assuming the default role is 'user'
            const defaultRole = await RbacService.getRoleUsers(); // Adjust as needed
            const role = defaultRole.find(r => r.role === 'user')?._id;

            if (!role) {
                throw new AppError(StatusCodes.NOT_FOUND, "Default role not found");
            }

            // Create the user
            const newUser = await UserModel.create({
                slug: name.toLowerCase().replace(/\s/g, '-'),
                name,
                email,
                password: hashedPassword,
                phone,
                role
            });

            // Extract user info
            const userInfo = getInfoData({
                fields: ['_id', 'name', 'email'],
                object: newUser
            });

            return userInfo;
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
}
