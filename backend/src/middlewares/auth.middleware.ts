import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { HEADER } from "../libs/contants/header";
import { KeyTokenService } from "../services/keyToken.service";
import { decodeToken } from "../utils/token.util";

export const authen = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers[HEADER.CLIENT_ID]?.toString();
    if (!userId) {
        throw new AppError(StatusCodes.FORBIDDEN, `Missing clientID`);
    }

    const keyStore = await KeyTokenService.getKeyByUserId(userId);
    if (!keyStore) {
        throw new AppError(StatusCodes.NOT_FOUND, `Not found keyStore`);
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString().replace('Bearer ', '');
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString();

    if (!accessToken) {
        throw new AppError(StatusCodes.FORBIDDEN, `Missing accessToken`);
    }

    try {
        const decodeUser = await decodeToken({ token: accessToken, publicKey: keyStore.publicKey });
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch (accessTokenError) {
        if (!refreshToken) {
            throw new AppError(StatusCodes.FORBIDDEN, `Missing refreshToken`);
        }

        try {
            const refreshTokenUsed = await KeyTokenService.findRefreshTokenUsed(refreshToken)

            if (refreshTokenUsed) {
                throw new AppError(StatusCodes.FORBIDDEN, `-----This refreshToken is used-----`);
            }
            const decodeRefreshToken = await decodeToken({ token: refreshToken, publicKey: keyStore.publicKey });

            if (!decodeRefreshToken) {
                throw new AppError(StatusCodes.FORBIDDEN, `-----Invalid refreshToken-----`);
            }
            req.keyStore = keyStore;
            req.user = decodeRefreshToken;
            req.refreshToken = refreshToken;
            return next();
        } catch (refreshTokenError: any) {
            throw new AppError(StatusCodes.FORBIDDEN, refreshTokenError.message);
        }
    }
};
