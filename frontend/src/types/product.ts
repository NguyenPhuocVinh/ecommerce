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
    image?: string
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

export interface IVaritation {
    name: string,
    values: string[]
}