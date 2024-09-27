import express, { Router } from "express";
import { AttributeController } from "../../controllers/attribute.controller";
import { authen } from "../../middlewares/auth.middleware";

const attributeRouter = Router();

attributeRouter.post("/create", AttributeController.createAttribute);
attributeRouter.get(`/`, AttributeController.getAllAttributes)

export default attributeRouter;