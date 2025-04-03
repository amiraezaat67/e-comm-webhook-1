import { Body, Controller, Post, Put, Res } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "../Services/auth.service";
import { ConfirmEmailBodyDto, SignInBodyDto, SignUpBodyDto } from "../DTO/auth.dto";
import { Auth, AuthUser } from "src/Common/Decorators";
import { IAuthUser } from "src/Common/Types";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    // @UseInterceptors(ResponseInterceptor)
    async SignUpHandler(
        @Body() body: SignUpBodyDto,
        @Res() res: Response
    ) {

        const result = await this.authService.SignUpService(body)
        res.status(201).json(result)
        // return {  result, message: 'User registered successfully' ,statusCode: 201}
    }


    @Put('confirm-email')
    async ConfirmEmailHandler(
        @Body() body: ConfirmEmailBodyDto,
        @Res() res: Response
    ) {
        const result = await this.authService.ConfirmEmailService(body)
        res.status(200).json({ message: 'Email confirmed', result })
    }

    @Post('login')
    async SignInHandler(
        @Body() body: SignInBodyDto,
        @Res() res: Response
    ) {
        const result = await this.authService.LoginService(body)
        res.status(201).json(result)
    }


    @Post('logout')
    @Auth('admin', 'user')
    async LogoutHandler(
        @AuthUser() authUser:IAuthUser,
        @Res() res: Response
    ) {
        await this.authService.LogoutService(authUser)
        res.status(200).json({ message: 'Logged out successfully' })
    }

}