import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { ProductModel, ClothModel } from "../models";
import { IProduct } from "../types/product.type";
import { IShop } from "../types/auth.type";
import slugify from "slugify";
import { ProductRepo } from "../repo/product.repo";
import mongoose from "mongoose";
import { removeUndefinedObject, updateNestedObjectParser } from "../utils/filter.util";
import { PRODUCT_TYPE } from "../libs/contants/productType";
import { InventoryRepo } from "../repo/inventory.repo";

export class ProductService {
    static productRegistry: { [key: string]: any } = {};

    static registerProductType(type: string, classRef: any) {
        this.productRegistry[type] = classRef;
    }

    static async createProduct(type: string, payload: IProduct) {
        const productClass = this.productRegistry[type];
        if (!productClass) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Invalid product type");
        }
        return new productClass(payload).createProduct();
    }

    static async updateProduct(type: string, productId: any, payload: any) {
        const product = await ProductRepo.findProduct({ productId });
        if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found')
        const productClass = this.productRegistry[type as string];
        if (!productClass) {
            throw new AppError(StatusCodes.BAD_REQUEST, "Invalid product type");
        }
        return new productClass(payload).updateProduct(productId);

    }


    //PUT
    static async publishProductByShop({ shop, productId }: { shop: IShop, productId: any }) {
        return await ProductRepo.publishProductByShop({ shop, productId })
    }

    static async unPublishProductByShop({ shop, productId }: { shop: IShop, productId: any }) {
        return await ProductRepo.unPublishProductbyShop({ shop, productId })
    }

    //QUERY
    static async findAllDraftsForShop({ shop, limit = 50, skip = 0 }: { shop: IShop, limit?: number, skip?: number }) {
        const query = { shop, isDraft: true };
        return await ProductRepo.findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ shop, limit = 50, skip = 0 }: { shop: IShop, limit?: number, skip?: number }) {
        const query = { shop, isPublished: true };
        return await ProductRepo.findAllPublishForShop({ query, limit, skip })
    }

    static async searchProducts({ keySearch }: { keySearch: any }) {
        return await ProductRepo.searchProductByUser({ keySearch })
    }

    static async findAllProducts({
        limit = 50,
        sort = 'ctime',
        page = 1,
        filter = { isPublished: true }
    }: {
        limit?: number,
        sort?: string,
        page?: number,
        filter?: any
    }) {
        return await ProductRepo.findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: ['name', 'price', 'thumb', 'shop', 'quantity']
        });
    }

    static async findProduct({ productId }: { productId?: any }) {
        return await ProductRepo.findProduct({
            productId, unselect: ['__v']
        }
        )
    }
}

class Product {
    name: string
    price: number
    description?: string
    thumb?: string
    quantity: number
    type?: string
    shop: IShop
    attributes?: any

    constructor({ name, price, description, thumb, quantity, type, shop, attributes }: IProduct) {
        this.name = name
        this.price = price
        this.description = description
        this.thumb = thumb
        this.quantity = quantity
        this.type = type
        this.shop = shop
        this.attributes = attributes
    }

    async createProduct(product_id: string) {
        const newProduct = await ProductModel.create({
            ...this,
            _id: product_id
        })

        if (newProduct) {
            await InventoryRepo.insertInventory({
                product: product_id,
                shop: this.shop,
                stock: this.quantity
            })
        }
        return newProduct
    }

    async updateProduct(productId: string, payload: any) {
        const productAfterRemoveEmpty = removeUndefinedObject(payload)
        const productAfterUpdateNested = updateNestedObjectParser(productAfterRemoveEmpty)
        return await ProductRepo.updateProductById({
            productId, payload: productAfterUpdateNested, model: ProductModel as any
        })
    }

}
class Cloth extends Product {
    brand?: string
    size?: string
    material?: string

    constructor({ brand, size, material, name, price, description, thumb, quantity, type, shop, attributes }: Cloth) {
        super({ name, price, description, thumb, quantity, type, shop, attributes })
        this.brand = brand
        this.size = size
        this.material = material
    }

    async createProduct() {
        const newCloth = await ClothModel.create({
            ...this.attributes,
            shop: this.shop
        })
        if (!newCloth) throw new Error('Cannot create new cloth')

        const newProduct = await super.createProduct(newCloth._id as string)
        if (!newProduct) throw new Error('Cannot create new product')

        return newProduct
    }

    async updateProduct(productId: string) {
        if (this.attributes) {
            await ProductRepo.updateProductById({
                productId,
                payload: this.attributes,
                model: ClothModel as any
            })
        }
        return super.updateProduct(productId, this)
    }

}

ProductService.registerProductType(PRODUCT_TYPE.CLOTHING, Cloth);
