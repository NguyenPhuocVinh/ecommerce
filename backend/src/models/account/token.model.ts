import mongoose, { Schema } from "mongoose";
import { IToken } from "../../types/auth.type";

export interface TokenDocument extends IToken, mongoose.Document { };

// export interface IToken {
//     user: any,
//     publicKey: string,
//     refreshTokenUsed?: string[]
//     refreshToken?: string
// }
const TokenSchema = new mongoose.Schema<TokenDocument>({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
    },
    refreshTokenUsed: [{
        type: String
    }],
    refreshToken: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const TokenModel = mongoose.model<TokenDocument>('Token', TokenSchema)