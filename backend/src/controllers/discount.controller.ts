import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { DiscountService } from "../services/discount.service";

export class DiscountController {
    static async createDiscountCode(req: Request, res: Response) {
        const data = await DiscountService.createDiscountCode(req.user, req.body)
        res.status(201).json({
            message: 'Discount code created successfully',
            data
        })
    }
}