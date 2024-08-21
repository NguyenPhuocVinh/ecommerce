import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export function routerNotFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error(`Router not found: ${req.url}`);
    // logging.error(error.message);
    console.log(error.message)
    res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
}