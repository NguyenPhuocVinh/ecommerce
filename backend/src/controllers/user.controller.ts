// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserRegisterDTO } from "../libs/dto/auth";
import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import validator from "validator";

export class UserController {
    static async registerUser(req: Request, res: Response) {
        try {
            const userDto = req.body;

            const newUser = await UserService.registerUser(userDto);
            return res.status(StatusCodes.CREATED).json({
                message: "User registered successfully",
                user: newUser
            });
        } catch (error: any) {
            return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    static async loginUser(req: Request, res: Response) {
        try {
            const { email, phone, password } = req.body;

            const user = await UserService.loginUser({ email, phone, password });

            return res.status(StatusCodes.OK).json({
                message: "User logged in successfully",
                user
            });
        } catch (error: any) {
            return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}
