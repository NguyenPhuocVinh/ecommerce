import pick from "lodash/pick";

export interface GetInfoDataParams<T> {
    fields: Array<keyof T>;
    object: T;
}

export interface QueryFilter {
    [key: string]: any
}

export const getInfoData = <T>({ fields, object }: GetInfoDataParams<T>) => {
    return pick(object, fields);
};

export const getSelectData = (select: string[] = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

export const unGetSelectData = (select: string[] = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]))
}


export const removeUndefinedObject = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') removeUndefinedObject(obj[key])
        else if (obj[key] === undefined || obj[key] === null) delete obj[key]
    })
    return obj
}

export const updateNestedObjectParser = (obj: any) => {
    const final: { [key: string]: any } = {}
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(i => {
                final[`${k}.${i}`] = response[i]
            })
        } else {
            final[k] = obj[k]
        }
    })
    return final
}