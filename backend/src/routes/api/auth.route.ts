import express from "express";
import { UserController } from "../../controllers/user.controller";
import { validateUserLogin, validateUserRegister } from "../../middlewares/validation.middleware";

const authRouter = express.Router();

authRouter.post("/register", validateUserRegister, UserController.registerUser);
authRouter.post("/login", validateUserLogin, UserController.loginUser);

export default authRouter;