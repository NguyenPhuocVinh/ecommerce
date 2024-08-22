import dotenv from 'dotenv';

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
export const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 4000;

export const MONGODB_URI: string = process.env.MONGODB_URI || '';

export const CLIENT_ID = process.env.CLIENT_ID || '';
export const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
export const REDIRECT_URI = process.env.REDIRECT_URI || '';
export const REFRESH_TOKEN = process.env.REFRESH_TOKEN || '';
export const EMAIL_USER = process.env.EMAIL_USER || '';
export const CALLBACK_URL = process.env.CALLBACK_URL || '';

export const AppConfig = {
    SERVER_HOSTNAME,
    SERVER_PORT,
    mail: {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        redirectUri: REDIRECT_URI,
        refreshToken: REFRESH_TOKEN,
        emailUser: EMAIL_USER,
    }
};

export const MongoDBConfig = {
    MONGODB_URI
};

