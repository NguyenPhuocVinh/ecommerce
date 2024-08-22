import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { google } from 'googleapis';
import { AppConfig } from './app.config';

const o2Auth2Client = new google.auth.OAuth2(
    AppConfig.mail.clientId,
    AppConfig.mail.clientSecret,
    AppConfig.mail.redirectUri
);


o2Auth2Client.setCredentials({ refresh_token: AppConfig.mail.refreshToken });


function getAccessToken() {
    return new Promise((resolve, reject) => {
        o2Auth2Client.getAccessToken((err, token) => {
            if (err) {
                reject("Failed to create access token ");
            }
            resolve(token);
        });
    });
}

export function createTransporter(): Promise<nodemailer.Transporter> {
    return new Promise(async (resolve, reject) => {
        const accessToken = await getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: AppConfig.mail.emailUser,
                clientId: AppConfig.mail.clientId,
                clientSecret: AppConfig.mail.clientSecret,
                refreshToken: AppConfig.mail.refreshToken,
                accessToken
            }
        } as SMTPTransport.Options);
        resolve(transporter);
    });
}