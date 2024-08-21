import express from "express";
import shopRouter from "./shop.route";
import productRouter from "./product.route";
import discountRouter from "./discount.route";
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
    res.send("Hello World");
});

apiRouter.use(`/shop`, shopRouter);
apiRouter.use(`/product`, productRouter);
apiRouter.use(`/discount`, discountRouter)
export default apiRouter;