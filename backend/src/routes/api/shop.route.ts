import express from "express";
import { ShopController } from "../../controllers/shop.controller";
import { authen } from "../../middlewares/auth.middleware";
const shopRouter = express.Router();

shopRouter.post(`/register`, ShopController.register);
shopRouter.post(`/login`, ShopController.login);

shopRouter.use(authen);
shopRouter.post(`/logout`, ShopController.logout);
shopRouter.post(`/refresh-token`, ShopController.refreshToken);
shopRouter.get(`/`, (req, res) => {
    res.json({ message: 'Hello' })
});


export default shopRouter;