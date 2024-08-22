// declare namespace Express {
//     export interface Response {
//         errorMessage?: string
//     }

import { ROLE_STATUS } from "../libs/contants/role"
import { TEMPLATE_STATUS } from "../libs/contants/template"

//     export interface Request {
//         objKey?: any
//         keyStore?: any
//         user?: any
//         refreshToken?: string
//         files?: any
//         requestId?: string
//     }
// }

declare module 'express' {
    interface Response {
        errorMessage?: string
    }

    interface Request {
        objKey?: any
        keyStore?: any
        user?: any
        refreshToken?: string
        files?: any
        requestId?: string
    }
}

export interface IShop {
    _id?: any,
    name: string,
    email: string,
    password: string,
    status: string,
    role: string[]
}

export interface IToken {
    user: any,
    publicKey: string,
    refreshTokenUsed?: string[]
    refreshToken?: string
}

export interface IDecodeToken {
    userId?: any,
    email?: string
}

export interface IUser {
    // _id?: any,
    slug: string,
    name: string,
    password: string,
    email: string,
    phone: string
    sex: string,
    avatar: string,
    date_of_birth: Date,
    role: any,
    status: ROLE_STATUS
}

export interface IOtp {
    otp: string,
    email: string,
    status: boolean
    expired_at: Date
}

export interface ITemplate {
    templateId: Number
    name: string
    status: TEMPLATE_STATUS
    html: string
}


