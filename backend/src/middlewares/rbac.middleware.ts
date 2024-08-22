import { Request, Response, NextFunction } from "express";
import { rbac } from "./role.middleware";
import { AppError } from "../erorrs/AppError.error";
import { RbacService } from "../services/rbac.service";
import { StatusCodes } from "http-status-codes";

/**
 * @desc Grant access to a resource
 * @param {string} action - create:any, read:any, update:any, delete:any, create:own, read:own, update:own, delete:own
 * @param {*} resource - profile, balance, ...
 * */

export const grantAccess = (action: string, resource: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            rbac.setGrants(
                await RbacService.roleList({
                    userId: req.user._id
                })
            );
            const role_name = req.query.role as string;
            const permission = await (rbac.can(role_name) as any).execute(action).on(resource);
            if (!permission.granted) throw new AppError(StatusCodes.FORBIDDEN, 'Permission denied');

            next();
        } catch (error) {
            next(error);
        }
    };
};

