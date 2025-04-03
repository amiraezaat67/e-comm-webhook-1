import { Global, Module } from "@nestjs/common";
import { BlackListedTokensModel, UserModel } from "./Models";
import { BlackListedTokensRepository, UserRespository } from "./Repositories";
import { TokenService } from "src/Common/Services";
import { JwtService } from "@nestjs/jwt";


@Global()
@Module({
    imports: [UserModel, BlackListedTokensModel],
    providers: [UserRespository, BlackListedTokensRepository, TokenService, JwtService],
    exports: [UserModel, BlackListedTokensModel, UserRespository, BlackListedTokensRepository, TokenService, JwtService]
})
export class AuthenticationModule { }