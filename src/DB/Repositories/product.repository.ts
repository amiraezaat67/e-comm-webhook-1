import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductType } from "../Models/product.model";
import { Model } from "mongoose";
import { BaseService } from "../base.service";



@Injectable()
export class ProductRepository extends BaseService<ProductType> {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductType>
    ) {
        super(productModel)
    }

    async decrementStock(cart) {
        for (const product of cart.products) {
            await this.updateOne({ filters: { _id: product.id }, update: { $inc: { stock: -product.quantity } } })
        }
    }
}