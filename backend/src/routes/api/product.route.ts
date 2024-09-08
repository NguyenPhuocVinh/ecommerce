import express from "express";
import { authen } from "../../middlewares/auth.middleware";
import { ProductController } from "../../controllers/product.controller";
const productRouter = express.Router();


// productRouter.get(`/search/:q`, ProductController.getListSearchProduct);
productRouter.get(`/`, ProductController.findAllProducts);
productRouter.get(`/search`, ProductController.searchProduct);
productRouter.get(`/search/v2`, ProductController.searchProductV2);
productRouter.get(`/:productId`, ProductController.findProduct);





productRouter.post(`/create/spu`, ProductController.createSpuV2);
productRouter.get(`/sku/:spuId/:skuId`, ProductController.getOneSku);
productRouter.get(`/spu/:spuId`, ProductController.findSpu);
productRouter.use(authen);
productRouter.post(`/create`, ProductController.createProduct);
productRouter.post(`/publish/:productId`, ProductController.publishProductByShop);
productRouter.post(`/unpublish/:productId`, ProductController.unPublishProductByShop);

//Spu


// QUERY //
productRouter.get(`/drafts/all`, ProductController.getAllDraftsForShop);
productRouter.get(`/published/all`, ProductController.getAllPublishForShop);

//update
productRouter.patch(`/update/:productId`, ProductController.updateProduct)

export default productRouter;