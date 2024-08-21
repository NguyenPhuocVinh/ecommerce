export interface IProduct {
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