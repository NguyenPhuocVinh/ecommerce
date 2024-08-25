import express from "express";
import { authen } from "../../middlewares/auth.middleware";
import { CartController } from "../../controllers/cart.controller";
const cartRouter = express.Router();

cartRouter.use(authen);
cartRouter.post(`/add-to-cartv2`, CartController.addToCartV2);



export default cartRouter;