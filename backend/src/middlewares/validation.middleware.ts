import { Request, Response, NextFunction } from "express";
import validator from "validator";
import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { UserRegisterDTO } from "../libs/dto/auth";

// Middleware to validate user registration data
export const validateUserRegister = (req: Request, res: Response, next: NextFunction) => {
    const userDto: UserRegisterDTO = req.body;

    if (!validator.isEmail(userDto.email)) {
        throw new AppError(StatusCodes.BAD_REQUEST, `${userDto.email} is not a valid email`);
    }
    if (!validator.isMobilePhone(userDto.phone, "vi-VN")) {
        throw new AppError(StatusCodes.BAD_REQUEST, `${userDto.phone} is not a valid phone number`);
    }

    next();
};

// Middleware to validate user login data
export const validateUserLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, phone } = req.body;

    if (!email && !phone) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Email or phone number is required");
    }

    if (email && !validator.isEmail(email)) {
        throw new AppError(StatusCodes.BAD_REQUEST, `${email} is not a valid email`);
    }

    if (phone && !validator.isMobilePhone(phone, "vi-VN")) {
        throw new AppError(StatusCodes.BAD_REQUEST, `${phone} is not a valid phone number`);
    }

    next();
};
