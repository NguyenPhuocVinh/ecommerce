import express from "express";
import { authen } from "../../middlewares/auth.middleware";
// import { ProductController } from "../../controllers/product.controller";
import { ProductController } from "../../controllers/product.controllerv2";
const productRouter = express.Router();


//Create
productRouter.post(`/create`, ProductController.createProduct)
productRouter.post(`/create/variant`, ProductController.createVariant)

//search
productRouter.post(`/search`, ProductController.searchProduct)

//Upload Image

//Get Publish
productRouter.get(`/get-publish`, ProductController.getAllPublishProduct)
productRouter.get(`/get-publish:productId`, ProductController.getPublishProductWithVariantsAndAttributes)

productRouter.delete(`/delete`, ProductController.deleteProduct)

// productRouter.use(authen)

//Publish product by shop
productRouter.post(`/publish`, ProductController.publicProductByShop)
productRouter.post(`/unpublish`, ProductController.unPublicProductByShop)

//Update
productRouter.patch(`/update/:productId`, ProductController.updateProduct)

//Get
productRouter.get(`/`, ProductController.getAllProduct)
productRouter.get(`/:productId`, ProductController.getProductWithVariantsAndAttributes)

// // productRouter.get(`/search/:q`, ProductController.getListSearchProduct);
// productRouter.get(`/`, ProductController.findAllProducts);
// productRouter.get(`/search`, ProductController.searchProduct);
// productRouter.get(`/search/v2`, ProductController.searchProductV2);
// productRouter.get(`/get-all-sku`, ProductController.getPublishedSkus);

// //upload image
// productRouter.put(`/upload/:skuId`, ProductController.uploadImageSku);
// // productRouter.get(`/:productId`, ProductController.findProduct);





// productRouter.post(`/create/spu`, ProductController.createSpu);
// productRouter.get(`/sku/:spuId/:skuId`, ProductController.getOneSku);
// productRouter.get(`/spu/:spuId`, ProductController.findSpu);
// productRouter.use(authen);
// // productRouter.post(`/create`, ProductController.createProduct);
// productRouter.post(`/publish/:productId`, ProductController.publishProductByShop);
// productRouter.post(`/unpublish/:productId`, ProductController.unPublishProductByShop);

// //Spu


// // QUERY //
// productRouter.get(`/drafts/all`, ProductController.getAllDraftsForShop);
// productRouter.get(`/published/all`, ProductController.getAllPublishForShop);

// //update
// productRouter.patch(`/update/:productId`, ProductController.updateProduct)

export default productRouter;