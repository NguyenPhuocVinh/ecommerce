import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error encountered:', err);

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: {
                message: err.message,
                statusCode: err.statusCode,
                isOperational: err.isOperational
            }
        });
    }
    else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: {
                message: "An unexpected error occurred",
            }
        });
    }

};
