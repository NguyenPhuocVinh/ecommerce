import { CategoryModel } from "../models/category.mode";
import { ICategory } from "../types/product.type";

export class CategoryService {
    static async createCategory(category: ICategory) {
        const newCategory = await CategoryModel.create(category);
        return newCategory;
    }
    static async getAllCategories() {
        const categories = await CategoryModel.find();
        const parentCategories = categories.filter(category => (category.parentCategory?.length ?? 0) > 0);
        const allCategoriesWithChildren = await Promise.all(
            parentCategories.map(async (category) => {
                const populatedCategory = await this.getChildCategory(category._id);
                return populatedCategory;
            })
        );

        return allCategoriesWithChildren;
    }

    private static async getChildCategory(categoryId: any) {
        const category = await CategoryModel.findById(categoryId)
            .populate({
                path: 'parentCategory',
                populate: { path: 'parentCategory' } // Recursively populate children
            });

        if (!category) {
            return { message: 'Category not found' };
        }

        return category;
    }
}
