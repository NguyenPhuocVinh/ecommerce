import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { ICategory } from "../types/product.type";
import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
    static async createCategory(req: Request, res: Response) {
        try {
            const payload: ICategory = req.body;
            const category = await CategoryService.createCategory(payload)
            return res.status(StatusCodes.CREATED).json(category)
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    }

    static async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await CategoryService.getAllCategories();
            return res.status(StatusCodes.OK).json(categories)
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    }
}