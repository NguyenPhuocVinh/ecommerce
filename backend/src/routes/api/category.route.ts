import express, { Router } from "express";
import { CategoryController } from "../../controllers/category.controller";
import { authen } from "../../middlewares/auth.middleware";

const categoryRouter = Router();

categoryRouter.post("/create", CategoryController.createCategory);

export default categoryRouter;  