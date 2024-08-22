import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { RbacService } from "../services/rbac.service";

export class RbacController {
    static async createRole(req: Request, res: Response) {
        try {
            const data = await RbacService.createRole(req.body)
            res.status(StatusCodes.CREATED).json({
                message: 'Create new role successfully',
                data
            })
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async createResource(req: Request, res: Response) {
        try {
            const data = await RbacService.createResource(req.body)
            res.status(StatusCodes.CREATED).json({
                message: 'Create new resource successfully',
                data
            })
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async roleList(req: Request, res: Response) {
        try {
            const data = await RbacService.roleList({ userId: req.user._id })
            res.status(StatusCodes.OK).json({
                message: 'Get all roles successfully',
                data
            })
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async resourceList(req: Request, res: Response) {
        try {
            const data = await RbacService.resourceList({ userId: req.user._id })
            res.status(StatusCodes.OK).json({
                message: 'Get all resources successfully',
                data
            })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async getRoleUser(req: Request, res: Response) {
        try {
            const data = await RbacService.getRoleUsers()
            res.status(StatusCodes.OK).json({
                message: 'Get role user successfully',
                data
            })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

}