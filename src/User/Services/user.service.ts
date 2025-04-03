import { Injectable } from "@nestjs/common";
import { IAuthUser } from "src/Common/Types";
import { UserRespository } from "src/DB/Repositories";



@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRespository
    ) { }


    async ProfileService(authUser:IAuthUser) {
        const user = await this.userRepository.findOne({ filters: { _id: authUser.user._id } })
        return user
    }
}