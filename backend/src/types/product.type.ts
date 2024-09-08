import { ObjectId } from "mongoose"
import { IShop } from "./auth.type"
import { IAttribute } from "./attributes.type"

export interface IProduct {
    _id?: any,
    name: string,
    thumb?: string,  // Make thumb optional
    description?: string,
    slug?: string,
    price: number,
    quantity: number,
    type?: string,
    shop: any,
    attributes: any,
    ratingAverage?: number,
    variation?: any,
    isDraft?: boolean,
    isPublished?: boolean,
}


export interface IClothes {
    brand: string,
    size: string,
    meterial: string,
    shop: any,
}

export interface IElectronic {
    manufacturer?: string
    modelName?: string
    color?: string
    shop: any
}

export interface IFurniture {
    material?: string
    color?: string
    weight?: number
    shop: any
}

export interface IPrice {
    productId: any,
    price: number;
    currency: string;
    startDate?: Date;
    endDate?: Date;
}


export interface ISpu {
    _id?: any
    productName: string
    slug?: string
    thumb?: string
    description?: string
    price: number
    category: any
    quantity: number
    shop?: any
    attributes?: any
    ratingsAverage?: number
    variations?: any[]
    isDraft?: boolean
    isPublished?: boolean
    isDeleted?: boolean
}

export interface SpuCreatePayload {
    spu: ISpuM;
    sku_list: ISkuM[];
}

export interface SkuCreatePayload {
    tierIndex?: number[]
    default: boolean
    sort?: number
    price: number
    stock: number
    product: string
    isDraft?: boolean
    isPublished?: boolean
}

export interface ISku {
    _id?: any
    tierIndex?: number[]
    default: boolean
    sort?: number
    price: number
    stock: number
    product?: ISpu
    isDraft?: boolean
    isPublished?: boolean
    isDeleted?: boolean
}

export interface ISpuM {
    _id?: any
    productName: string
    slug?: string
    thumb?: string
    description?: string
    price: number
    category: any
    quantity: number
    // shop?: any
    attributeIds?: {
        attributeId?: any
        valueId?: any
    }
    ratingsAverage?: number
    variations?: IVaritation[]
    isDraft?: boolean
    isPublished?: boolean
    isDeleted?: boolean
}
export interface ISkuM {
    _id?: any
    spu: ISkuM
    tierIndex?: number[]
    default: boolean
    sort?: number
    price: number
    stock: number
    product?: ISpu
    isDraft?: boolean
    isPublished?: boolean
    isDeleted?: boolean
}

export interface IVaritation {
    name: string,
    values: string[]
}

export interface ICategory {
    name: string
    slug?: string
    description?: string
    thumb?: string
    parentCategory?: ICategory[]
}