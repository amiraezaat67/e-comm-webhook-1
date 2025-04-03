import { Injectable } from "@nestjs/common";
import { BaseService } from "../base.service";
import { User, UserType } from "../Models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";




@Injectable()
export class UserRespository extends BaseService<UserType> {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserType>) {
        super(userModel)
    }


    async findByEmail(email: string, confirmed?: boolean): Promise<UserType | null> {
        const filters: FilterQuery<UserType> = { email }
        if (confirmed !== undefined) {
            filters['isEmailVerified'] = confirmed
        }
        return await this.findOne({ filters })
    }
}