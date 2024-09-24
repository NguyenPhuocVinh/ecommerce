import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { AttributeService } from "../services/attribute.service";

export class AttributeController {
    static async createAttribute(req: Request, res: Response) {
        try {
            const attribute = await AttributeService.createAttribute(req.body)
            return res.status(StatusCodes.CREATED).json(attribute)
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    }
}