import dotenv from 'dotenv';

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === 'development';
export const TEST = process.env.NODE_ENV === 'test';

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
export const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 4000;

export const MONGODB_URI: string = process.env.MONGODB_URI || '';

export const AppConfig = {
    SERVER_HOSTNAME,
    SERVER_PORT
};

export const MongoDBConfig = {
    MONGODB_URI
};