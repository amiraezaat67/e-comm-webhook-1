import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import { OTPTypeEnum } from "src/Common/Types";


@Schema({ timestamps: true })
export class OTP {

    @Prop({ type: String, required: true })
    otp: string;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    userId: string | Types.ObjectId;

    @Prop({ type: Date, required: true })
    expiryTime: Date;

    @Prop({ type: String, enum: OTPTypeEnum, required: true, index: { name: 'OTP_type_index' } })
    otpType: string;
}

const OTPSchema = SchemaFactory.createForClass(OTP)

export const OTPModel = MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])

export type OTPType = HydratedDocument<OTP> & Document
