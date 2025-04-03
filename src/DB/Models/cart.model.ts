import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { User, Product } from ".";

@Schema({ timestamps: true })
export class Cart {

    @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: { name: "userId_idx_unique", unique: true } })
    userId: Types.ObjectId

    @Prop([{
        id: { type: Types.ObjectId, ref: Product.name, required: true },
        finalPrice: Number,
        quantity: { type: Number, default: 1, min: 1 }
    }])
    products: { id: Types.ObjectId, finalPrice: number, quantity: number }[]

    @Prop({
        type: Number,
        // default: function () { return this.products.reduce((total, product) => total + product.finalPrice * product.quantity, 0) }
    })
    subTotal: number

    // shippingFee and VAT
    @Prop({ type: Number, default: 50 })
    shippingFee: number

    @Prop({ type: Number, default: 30 })
    VAT: number
}

export const CartSchema = SchemaFactory.createForClass(Cart)

CartSchema.pre('save', function () {
    this.subTotal = this.products.reduce((total, product) => total + product.finalPrice * product.quantity, 0)
})

export type CartType = HydratedDocument<Cart> & Document

export const CartModel = MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])




