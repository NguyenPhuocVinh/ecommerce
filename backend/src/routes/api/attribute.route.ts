import express, { Router } from "express";
import { AttributeController } from "../../controllers/attribute.controller";
import { authen } from "../../middlewares/auth.middleware";

const attributeRouter = Router();

attributeRouter.post("/create", AttributeController.createAttribute);

export default attributeRouter;