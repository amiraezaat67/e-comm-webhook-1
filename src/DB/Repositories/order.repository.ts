


import { Injectable } from "@nestjs/common";
import { BaseService } from "../base.service";
import { Order, OrderType } from "../Models";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ProductRepository } from "./product.repository";
import { CartRepository } from "./cart.repository";



@Injectable()
export class OrderRepository extends BaseService<OrderType> {
    constructor(
        @InjectModel(Order.name) private readonly OrderModel: Model<OrderType>,
        private readonly productRepository: ProductRepository,
        private readonly cartRepository: CartRepository
    ) { super(OrderModel) }


    async createOrder(data) {
        const total = data.cart.subTotal

        const order = new this.OrderModel({
            userId: Types.ObjectId.createFromHexString(data.userId),
            cartId: data.cart._id,
            total,
            address: data.address,
            phone: data.phone,
            paymentMethod: data.paymentMethod,
            orderStatus: 'pending'
        })

        if (data.arriveAt) order.arriveAt = data.arriveAt
        if (data.paymentMethod == 'cash') order.orderStatus = 'placed'

        const newOrder = await order.save()

        //  update the products in the cart and decrement their stock by each product quantity
        this.productRepository.decrementStock(data.cart)
        // socket for connected clients

        return newOrder
    }

    // remove all items from the cart
    // this.cartRepository.updateOne({ filters: { _id: data.cart._id }, update: { products: [] } })
}