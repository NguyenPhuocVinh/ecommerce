import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { IDecodeToken, IShop } from "../types/auth.type";

export const CreateTokenPair = async ({ payload, privateKey }: { payload: IShop; privateKey: string }) => {
    try {
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1 day"
        });
        const refreshToken = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "7 days"
        });
        return { accessToken, refreshToken }
    } catch (error: any) {
        console.log(error.message)
    }
}

export const decodeToken = async ({ token, publicKey }: { token: any; publicKey: string }) => {
    try {
        // console.log(token, publicKey)
        const decoded = jwt.verify(token, publicKey, {
            algorithms: ['RS256'],
        });
        return decoded as IDecodeToken;
    } catch (error: any) {
        throw new AppError(StatusCodes.UNAUTHORIZED, `Verify token failed: ${error.message}`);
    }
};