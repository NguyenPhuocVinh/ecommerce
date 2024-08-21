// declare namespace Express {
//     export interface Response {
//         errorMessage?: string
//     }

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
