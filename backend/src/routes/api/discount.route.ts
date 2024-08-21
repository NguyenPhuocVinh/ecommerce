import express from "express";
import { authen } from "../../middlewares/auth.middleware";
import { DiscountController } from "../../controllers/discount.controller";
const discountRouter = express.Router();

discountRouter.use(authen);
discountRouter.post(`/create`, DiscountController.createDiscountCode)

export default discountRouter;