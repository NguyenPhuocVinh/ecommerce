import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { ResourceModel } from "../models/resource.model";
import { RoleModel } from "../models/role.model";

export class RbacService {
    static async createResource({ name, slug, description }: { name: string, slug: string, description: string }) {
        try {
            const resource = ResourceModel.create({
                name, slug, description
            })
            return resource
        } catch (error: any) {
            throw new AppError(error.statusCode, `error: ${error.message}`)
        }
    }

    static async resourceList({
        userId,
        limit = 30,
        offset = 0,
        search = ''
    }: {
        userId: string
        limit?: number
        offset?: number
        search?: string
    }) {
        try {
            const resources = await ResourceModel.aggregate([
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        slug: 1,
                        description: 1,
                        resourceId: '$_id',
                        createdAt: 1
                    }
                }
            ])
                .skip(offset)
                .limit(limit)

            return resources
        } catch (error: any) {
            throw new AppError(error.statusCode, `error: ${error.message}`)

        }
    }

    static async createRole({
        name,
        description,
        slug,
        grants = []
    }: {
        name: string
        description: string
        slug: string
        grants?: any[]
    }) {
        try {
            const roles = await RoleModel.create({
                rol_name: name,
                rol_description: description,
                rol_slug: slug,
                rol_grants: grants
            })
            return roles
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    static async roleList({
        userId,
        limit = 30,
        offset = 0,
        search = ''
    }: {
        userId: string
        limit?: number
        offset?: number
        search?: string
    }) {
        try {
            const roles = await RoleModel.aggregate([
                {
                    $unwind: '$rol_grants'
                },
                {
                    $lookup: {
                        from: 'resources', // Ensure the collection name is correct
                        localField: 'rol_grants.resource',
                        foreignField: '_id',
                        as: 'rol_grants.resource'
                    }
                },
                {
                    $unwind: '$rol_grants.resource'
                },
                {
                    $unwind: '$rol_grants.action'
                },
                {
                    $project: {
                        _id: 0,
                        role: '$rol_name',
                        resource: '$rol_grants.resource.name',
                        action: '$rol_grants.action',
                        attributes: '$rol_grants.attributes'
                    }
                }
            ])
                .skip(offset)
                .limit(limit)

            return roles
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message)
        }
    }

    static async getRoleUsers() {
        try {
            const user = await RoleModel.aggregate([
                {
                    $match: {
                        rol_name: "user"
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'role',
                        as: 'users'
                    }
                },
                {
                    $project: {
                        _id: '$_id',
                        role: '$rol_name',
                    }
                }
            ]);

            return user;
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}