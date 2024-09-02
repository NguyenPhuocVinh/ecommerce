import express from "express";
import { authen } from "../../middlewares/auth.middleware";
import { CartController } from "../../controllers/cart.controller";
const cartRouter = express.Router();

cartRouter.use(authen);
cartRouter.post(`/add-to-cartv2`, CartController.addToCartV2);
cartRouter.post(`/remove-product`, CartController.removeProductFromCart)
cartRouter.get(`/get-cart`, CartController.getCart)


export default cartRouter;