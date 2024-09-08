import { CategoryModel } from "../models/category.mode";
import { ICategory } from "../types/product.type";

export class CategoryService {
    static async createCategory(category: ICategory) {
        const newCategory = await CategoryModel.create(category);
        return newCategory;
    }
}
