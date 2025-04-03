import { Module } from "@nestjs/common";
import { AuthController } from "./Controllers/auth.controller";
import { AuthService } from "./Services/auth.service";
import { BlackListedTokensRepository, OtpRepository, UserRespository } from "src/DB/Repositories";
import { UserModel } from "src/DB/Models/user.model";
import { TokenService } from "src/Common/Services";
import { JwtService } from "@nestjs/jwt";
import {  BlackListedTokensModel, OTPModel } from "src/DB/Models";

@Module({
    imports: [UserModel, OTPModel, BlackListedTokensModel],
    controllers: [AuthController],
    providers: [AuthService, UserRespository, TokenService, JwtService, OtpRepository, BlackListedTokensRepository],
    exports: []
})
export class AuthModule { }
