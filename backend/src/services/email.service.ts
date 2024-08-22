import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { OtpService } from "./otp.service";
import { createTransporter } from "../configs/email.config";
import { AppConfig } from "../configs/app.config";
import { TemplateService } from "./template.service";

export class EmailService {
    static async sendOtpEmail(email: string) {
        try {
            const otp = await OtpService.createOtp(email);

            // Fetch the template and extract the HTML content
            const template = await TemplateService.getTemplate('verify-email', otp);
            const html = template.html; // This ensures html is a string

            // Send the email
            const sendInfo = await this.sendEmail({ to: email, subject: 'Verify your email', html });
            return sendInfo;
        } catch (error: any) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    private static async sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
        try {
            const transporter = await createTransporter();
            const info = await transporter.sendMail({
                from: AppConfig.mail.emailUser,
                to,
                subject,
                html // Use the extracted html string here
            });
            return info;
        } catch (error: any) {
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}
