import express from "express";
import { authen } from "../../middlewares/auth.middleware";
import { CheckoutController } from "../../controllers/checkout.controller";
const checkouRouter = express.Router();

checkouRouter.use(authen);
checkouRouter.post(`/review`, CheckoutController.checkoutReview);
checkouRouter.post(`/order`, CheckoutController.orderByUser);

export default checkouRouter;