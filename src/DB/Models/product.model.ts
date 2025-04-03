import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Document } from "mongoose";
import slugify from "slugify";

import { User, Category } from ".";

@Schema({ timestamps: true })
export class Product {

    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, default: function () { return slugify(this.title.toLowerCase()) }, index: { name: 'product_slug_idx' } })
    slug: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: Number, required: true })
    basePrice: number;

    @Prop({ type: Number })
    discount: number;

    @Prop({ type: Number, default: function () { return this.basePrice - (this.basePrice * ((this.discount || 0) / 100)) } })
    finalPrice: number;

    @Prop({ type: Number, required: true })
    stock: number;

    @Prop({ type: Number, default: 0 })
    overallRating: number;

    @Prop({ type: [{ secure_url: { type: String }, public_id: { type: String } }] })
    images: object[];

    @Prop({ type: String })
    folderId: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    addedBy: string | Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    categoryId: Types.ObjectId;
}

const ProductSchema = SchemaFactory.createForClass(Product)

export type ProductType = HydratedDocument<Product> & Document

export const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])


