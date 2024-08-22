import express from "express";
import { EmailController } from "../../controllers/email.controller";

const emailRouter = express.Router();

emailRouter.post('/template', EmailController.newTemplate);

export default emailRouter;