import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { Product } from "./product.model";
import { Cart, CartModel, User } from ".";

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: string;

    @Prop({ type: Types.ObjectId, ref: Cart.name, required: true })
    cartId: string;

    // @Prop({ type: Number })
    // shippingFee: number;

    // @Prop({ type: Number })
    // VAT: number

    @Prop({ type: Date, default: Date.now() + 3 * 24 * 60 * 60 * 1000 })
    arriveAt: Date

    @Prop({
        type: Number
    })
    total: number

    @Prop({ type: String, required: true })
    address: string

    @Prop({ type: String, required: true })
    phone: string

    @Prop({ type: String, enum: ['pending', 'placed', 'Preparing', 'On Way', 'delivered', 'returned', 'cancelled', 'refunded'] })
    orderStatus: string

    @Prop({ type: String, enum: ['cash', 'card'] })
    paymentMethod: string


    @Prop({ type: String })
    paymentIntentId: string

    // This field can be used to track the order changes and can be seperated on a model
    @Prop({
        type: {
            paidAt: Date,
            deliveredAt: Date,
            deliveredBy: { type: Types.ObjectId, ref: User.name }, // delivery person
            cancelledAt: Date,
            cancelledBy: { type: Types.ObjectId, ref: User.name }, // user should cancel his order
            refundedAt: Date,
            refundedBy: { type: Types.ObjectId, ref: User.name } // admins do manual refund , or in the cancellation api within a period
        }
    })
    orderChanges: object
}

export const OrderSchema = SchemaFactory.createForClass(Order)

export const OrderModel = MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])

export type OrderType = HydratedDocument<Order> & Document 