import crypto from 'crypto'
import { StatusCodes } from "http-status-codes";
import { TokenModel } from "../models/account/token.model";
import { AppError } from "../erorrs/AppError.error";
import { CreateTokenPair } from "../utils/token.util";
import { IToken } from '../types/auth.type';

export class KeyTokenService {
    static async generateToken(payload: any) {
        const { privateKey, publicKey } = await crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        const tokenPair = await CreateTokenPair({ payload, privateKey });
        if (!tokenPair)
            throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, `Fail to create token pair`)

        const publicKeyString = await this.createKeyToken({
            user: payload,
            publicKey,
            refreshToken: tokenPair.refreshToken
        })
        return tokenPair
    }

    private static async createKeyToken(payload: IToken) {
        try {
            const { publicKey, refreshToken } = payload;

            const filter = { user: payload.user };
            const update = {
                publicKey: publicKey.toString(),
                refreshToken: refreshToken
            };
            const options = { new: true, upsert: true };

            const tokens = await TokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error: any) {
            console.log(error);
        }
    }

    static async getKeyByUserId(userId: string) {
        return TokenModel.findOne({ user: userId }).lean();

    }

    static async removeKeyById(keyStoreId: string) {
        return TokenModel.findOneAndDelete({ _id: keyStoreId });
    }

    static async findRefreshTokenUsed(refreshToken: string) {
        return TokenModel.findOne({ refreshTokenUsed: refreshToken });
    }

    static async removeKeyTokenByUserId(userId: string) {
        return TokenModel.findOneAndDelete({ user: userId });
    }

    static async updateKeyTokenByUserId(userId: string, refreshToken: string) {
        return TokenModel.findOneAndUpdate({ user: userId }, {
            $set: { refreshToken },
            $addToSet: { refreshTokenUsed: refreshToken }
        });
    }
}
