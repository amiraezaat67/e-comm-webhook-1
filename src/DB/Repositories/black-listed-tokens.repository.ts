import { Injectable } from "@nestjs/common";
import { BaseService } from "../base.service";
import { BlackListedTokens, BlackListedTokensType } from "../Models";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";



@Injectable()
export class BlackListedTokensRepository extends BaseService<BlackListedTokensType> {

    constructor(@InjectModel(BlackListedTokens.name) private readonly blackListedTokensModel: Model<BlackListedTokensType>) {
        super(blackListedTokensModel)
    }
}
