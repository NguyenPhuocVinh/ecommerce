import express from "express";
import { authen } from "../../middlewares/auth.middleware";
const checkouRouter = express.Router();

checkouRouter.post(`/create`);

export default checkouRouter;