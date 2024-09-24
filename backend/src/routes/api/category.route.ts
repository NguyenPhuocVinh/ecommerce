import express, { Router } from "express";
import { CategoryController } from "../../controllers/category.controller";
import { authen } from "../../middlewares/auth.middleware";

const categoryRouter = Router();

categoryRouter.post("/create", CategoryController.createCategory);

categoryRouter.get("/all", CategoryController.getAllCategories);

export default categoryRouter;  