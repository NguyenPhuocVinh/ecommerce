import bcrypt from "bcrypt"
import { StatusCodes } from "http-status-codes";
import { ShopModel } from "../models/account";
import { AppError } from "../erorrs/AppError.error";
// import { CreateTokenPair, VerifyToken } from "../utils/token.util";
import { IToken, IShop } from '../types/auth.type';
import { KeyTokenService } from "./keyToken.service";
import { SHOP_STATUS } from "../libs/contants/shop";
import { getInfoData } from "../utils/filter.util";
import { TokenDocument } from "../models/account/token.model";

export class ShopService {
    static async register(body: IShop) {
        try {
            const { email, password } = body;
            const exitedEmail = await ShopModel.findOne({ email }).lean();

            if (exitedEmail)
                throw new AppError(StatusCodes.BAD_REQUEST, `Shop is already registered`);

            const hashPassword = await bcrypt.hash(password, 10);
            const newShop = await ShopModel.create({
                ...body,
                password: hashPassword,
                status: SHOP_STATUS.OPEN
            });
            const shopInfo = getInfoData({
                fields: ['_id', 'name', 'email'],
                object: newShop
            });
            const { accessToken, refreshToken } = await KeyTokenService.generateToken(shopInfo);
            return {
                shop: shopInfo,
                tokens: {
                    accessToken,
                    refreshToken
                }
            };
        } catch (error: any) {
            throw new AppError(error.statusCode, error.message)
        }
    }
    static async loggin(body: Pick<IShop, 'email' | 'password'>) {
        try {
            const { email, password } = body;
            const shop = await ShopModel.findOne({ email }).lean();
            if (!shop)
                throw new AppError(StatusCodes.NOT_FOUND, `Email not found`)

            const isMatch = await bcrypt.compare(password, shop.password);
            if (!isMatch)
                throw new AppError(StatusCodes.BAD_REQUEST, `Wrong password`)

            const shopInfo = getInfoData({
                fields: ['_id', 'name', 'email'],
                object: shop
            });
            const { accessToken, refreshToken } = await KeyTokenService.generateToken(shopInfo);
            return {
                shop: {
                    shopInfo
                },
                tokens: {
                    accessToken, refreshToken
                }
            }
        } catch (error: any) {
            throw new AppError(error.statusCode, error.message)
        }
    }

    static async logout(keyStore: any) {
        try {
            await KeyTokenService.removeKeyById(keyStore._id);
        } catch (error: any) {
            throw new AppError(error.statusCode, error.message)
        }
    }

    static async refreshToken({
        refreshToken,
        user
    }: {
        refreshToken: string;
        user: IShop;
    }) {
        const shop = await this.findByEmail(user.email)
        if (!shop) throw new AppError(StatusCodes.NOT_FOUND, 'Email not found')

        await KeyTokenService.updateKeyTokenByUserId(user._id, refreshToken)
        const tokens = await KeyTokenService.generateToken(shop)


        return {
            shop: getInfoData({
                fields: ['_id', 'email', 'name', 'role', 'status'],
                object: shop
            }),
            tokens
        }
    }


    private static async findByEmail(email: string) {
        return ShopModel.findOne({ email }).lean()
    }
}