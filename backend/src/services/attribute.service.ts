import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { AttributeModel, IAttribute } from "../models/product/attribute.mode";
import { Types } from "mongoose";
export class AttributeService {
    static async createAttribute(payload: IAttribute) {
        return AttributeModel.create(payload)
    }

    static async getAttributes(attributeIds: Types.ObjectId[]): Promise<{ attributeName: string; value: string }[]> {
        const attributes = await AttributeModel.find({ _id: { $in: attributeIds } }).exec();
        return attributes.map(attr => ({
            attributeName: attr.attributeName,
            value: attr.value // Ensure this is of type string or ObjectId
        }));
    }

}


// export function createAttribute(payload: IAttribute[]) {
//     return AttributeModel.insertMany(payload)
// }

// createAttribute(payload)



