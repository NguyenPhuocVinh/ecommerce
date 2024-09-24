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



export interface SpuCreatePayload {
    spu: ISpu;
    sku_list: ISku[];
}

export interface SkuCreatePayload {
    default: boolean
    sort?: number
    price: number
    stock: number
    product: string
    isDraft?: boolean
    isPublished?: boolean
}

// export interface ISku {
//     _id?: any
//     tierIndex?: number[]
//     default: boolean
//     sort?: number
//     price: number
//     stock: number
//     product?: ISpu
//     isDraft?: boolean
//     isPublished?: boolean
//     isDeleted?: boolean
//     thumb?: string
// }

export interface ISpu {
    _id?: any
    productName: string
    slug?: string
    thumb?: string
    description?: string
    price: number
    category: any
    feature: boolean
    ratingsAverage?: number
    variations?: ISku[]
    isDraft?: boolean
    isPublished?: boolean
    isDeleted?: boolean
}
export interface ISku {
    _id?: any
    spuId: string
    thumb: string
    default: boolean
    color: string
    size: string
    price: number
    stock: number
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