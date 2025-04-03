import { Injectable, NotFoundException } from "@nestjs/common";
import { BaseService } from "../base.service";
import { Category, CategoryType } from "../Models";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Product, ProductType } from "../Models/product.model";
import { ProductRepository } from "./product.repository";



@Injectable()
export class CategoryRepository extends BaseService<CategoryType> {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryType>,
        private readonly productRepository: ProductRepository
    ) { super(categoryModel) }


    async getCategories() {
        return await this.categoryModel.find()
    }

    async deleteCategoryWithRelatedDocs(categoryId: Types.ObjectId) {
        const category = await this.deleteOne({ filters: { _id: categoryId } })
        if (!category) {
            throw new NotFoundException('Category not found')
        }
        // get the related products 
        const relatedProducts = await this.productRepository.find({ filters: { categoryId } }) as ProductType[]
        console.log(relatedProducts);

        if (relatedProducts.length) {
            // delete the products related to the category
            await this.productRepository.deleteMany({ filters: { categoryId } })
        }

        return true;
    }
}