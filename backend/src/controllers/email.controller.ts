import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { EmailService } from "../services/email.service";
import { TemplateService } from "../services/template.service";
import { NewTemplateDto } from "../libs/dto/template";

export class EmailController {
    static async newTemplate(req: Request, res: Response) {
        try {
            const newTemplateDto = req.body as NewTemplateDto;
            const newTemplate = await TemplateService.newTemplate(newTemplateDto);
            return res.status(StatusCodes.CREATED).json(newTemplate);
        } catch (error: any) {
            return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
}