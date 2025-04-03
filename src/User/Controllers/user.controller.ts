import { Controller, Get, Res } from "@nestjs/common";
import { UserService } from "../Services/user.service";
import { Auth, AuthUser } from "src/Common/Decorators";
import { UserType } from "src/DB/Models";
import { Response } from "express";
import { IAuthUser } from "src/Common/Types";


@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) { }

    // GET
    @Get('profile')
    @Auth('admin', 'user')
    async ProfileHandler(
        @AuthUser() authUser: IAuthUser,
        @Res() res: Response
    ) {

        const result = await this.userService.ProfileService(authUser)
        res.status(200).json({ message: 'Profile', result })
    }
}
