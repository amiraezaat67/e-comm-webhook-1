import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";


@Schema({ timestamps: true })
export class BlackListedTokens {
    @Prop({ type: String, required: true })
    token: string

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: string | Types.ObjectId;

    @Prop({ type: Date, required: true })
    expiryTime: Date
}

export const BlackListedTokensSchema = SchemaFactory.createForClass(BlackListedTokens);

export const BlackListedTokensModel = MongooseModule.forFeature([{ name: BlackListedTokens.name, schema: BlackListedTokensSchema }]);

export type BlackListedTokensType = HydratedDocument<BlackListedTokens> & Document;
