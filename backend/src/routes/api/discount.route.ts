import express from "express";
import { authen } from "../../middlewares/auth.middleware";
import { DiscountController } from "../../controllers/discount.controller";
const discountRouter = express.Router();

discountRouter.get(`/get-all-product-discount`, DiscountController.getAllProductsWithDiscountCode);
discountRouter.get(`/get-discout-by-shop`, DiscountController.getAllDiscountsByShop)
discountRouter.use(authen);
discountRouter.post(`/create`, DiscountController.createDiscountCode)
discountRouter.delete(`/delete/:code`, DiscountController.deleteDiscountCode)
discountRouter.patch(`/cancel`, DiscountController.cancelDiscountCode)

export default discountRouter;