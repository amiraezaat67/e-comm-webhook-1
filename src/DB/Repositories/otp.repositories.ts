import { Injectable } from "@nestjs/common";
import { BaseService } from "../base.service";
import { OTP, OTPType } from "../Models";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { OTPTypeEnum } from "src/Common/Types";
import { Hash } from "src/Common/Security";


@Injectable()
export class OtpRepository extends BaseService<OTPType> {
    constructor(@InjectModel(OTP.name) model: Model<OTPType>) {
        super(model)
    }

    async createOtp(userId: string | Types.ObjectId, otp: string, otpType: OTPTypeEnum) {
        await this.create({
            userId,
            otp: Hash(otp),
            otpType,
            expiryTime: new Date(Date.now() + 1000 * 60 * 10) // 10 minutes
        })
    }
}