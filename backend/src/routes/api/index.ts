import express from "express";
import shopRouter from "./shop.route";
import productRouter from "./product.route";
import discountRouter from "./discount.route";
import rbacRouter from "./rbac.route";
import authRouter from "./auth.route";
import emailRouter from "./email.route";
import cartRouter from "./cart.route";
// import checkouRouter from "./checkout.route";
import attributeRouter from "./attribute.route";
import categoryRouter from "./category.route";
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
    res.send("Hello World");
});

apiRouter.use(`/shop`, shopRouter);
apiRouter.use(`/product`, productRouter);
apiRouter.use(`/discount`, discountRouter);
apiRouter.use(`/rbac`, rbacRouter);
apiRouter.use(`/auth`, authRouter);
apiRouter.use(`/email`, emailRouter);
apiRouter.use(`/cart`, cartRouter);
// apiRouter.use(`/checkout`, checkouRouter);
apiRouter.use(`/attribute`, attributeRouter);
apiRouter.use(`/category`, categoryRouter);
export default apiRouter;