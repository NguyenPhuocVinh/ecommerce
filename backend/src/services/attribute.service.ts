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
            value: attr.value
        }));
    }

    static async getAllAttributes() {
        const groupedAttributes = await AttributeModel.aggregate([

            {
                $group: {
                    _id: "$attributeName",
                    attributes: {
                        $addToSet: {
                            _id: "$_id",
                            value: "$value",
                            __v: "$__v"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    attributeName: "$_id",
                    attributes: 1
                }
            }
        ]);

        return groupedAttributes;
    }


}



