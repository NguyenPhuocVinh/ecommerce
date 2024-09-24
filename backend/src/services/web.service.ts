import express from "express";
import http from "http";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";

import { logginHandler } from "../middlewares/loggingHandler.middleware";
import { errorHandler } from "../middlewares/errorHandler.middleware";
import { routerNotFound } from "../erorrs/RouterNotFound.error";

import { AppConfig } from "../configs/app.config";
import mainRouter from "../routes";

export class WebService {
    private app: express.Application;
    private server: http.Server;
    private port: number;
    private hostname: string;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.port = AppConfig.SERVER_PORT;
        this.hostname = AppConfig.SERVER_HOSTNAME;
        this.addMiddlewares();
    }

    private addMiddlewares() {
        const middlewares = [
            express.json(),
            express.urlencoded({ extended: true }),
            helmet(),
            morgan("dev"),
            compression(),
            cors({
                origin: 'http://localhost:3000',
                credentials: true,
            }),
            // logginHandler,
            mainRouter,
            routerNotFound,
            errorHandler,
        ];

        middlewares.forEach(middleware => this.app.use(middleware));
    }

    public async start() {
        this.server.listen(this.port, () => {
            console.log(`Server is running at http://${this.hostname}:${this.port}`);
        });
    }
}
