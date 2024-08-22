export interface IRole {
    rol_name: string,
    rol_slug: string,
    rol_status: string,
    rol_description: string,
    rol_grants: IGrants[],
}

export interface IResource {
    name: string,
    slug: string,
    description: string
}


export interface IGrants {
    resource: any,
    actions: string[],
    attributes: string
}