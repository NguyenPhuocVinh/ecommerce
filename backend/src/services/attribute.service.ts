import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { IAttribute } from "../types/attributes.type";
import { AttributeModel } from "../models/product/attribute.mode";
export class AttributeService {
    static async createAttribute(payload: IAttribute) {
        return AttributeModel.create(payload)
    }
}


// export function createAttribute(payload: IAttribute[]) {
//     return AttributeModel.insertMany(payload)
// }

// createAttribute(payload)



