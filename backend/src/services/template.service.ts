import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { NewTemplateDto } from "../libs/dto/template";
import { TemplateModel } from "../models/email/template.model";
import { generateTemplate } from "../utils/template.util";

export class TemplateService {
    static async newTemplate(newTemplateDto: NewTemplateDto) {
        const { name, templateId, html } = newTemplateDto
        const newTemplate = await TemplateModel.create({ name, templateId: Number(templateId), html: generateTemplate(html) })
        return newTemplate
    }

    static async getTemplate(name: string, otp?: string) {
        const template = await TemplateModel.findOne({ name }).lean()
        if (!template) throw new AppError(StatusCodes.NOT_FOUND, 'Template not found')
        if (otp) {
            template.html = template.html.split('{{code}}').join(otp)
        }
        return template
    }
}
