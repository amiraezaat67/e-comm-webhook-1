import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductType } from "../Models/product.model";
import { Model } from "mongoose";
import { BaseService } from "../base.service";
import { CartType } from "../Models";
import { RealTimeEventsGateway } from "src/Common/gateways";



@Injectable()
export class ProductRepository extends BaseService<ProductType> {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductType>,
        private readonly RealTimeEventsGateway: RealTimeEventsGateway
    ) {
        super(productModel)
    }

    async decrementStock(cart: CartType) {
        for (const product of cart.products) {
            const newProduct = await this.updateOne({ filters: { _id: product.id }, update: { $inc: { stock: -product.quantity } } })
            if (!newProduct) continue;
            this.RealTimeEventsGateway.emitStockUpdates(product.id, newProduct.stock)
        }
    }
}