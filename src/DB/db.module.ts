import { Global, Module } from "@nestjs/common";
import { BlackListedTokensModel, UserModel } from "./Models";
import { BlackListedTokensRepository, UserRespository } from "./Repositories";
import { TokenService } from "src/Common/Services";
import { JwtService } from "@nestjs/jwt";
import { EventsModule } from "src/Common/gateways/gateway.module";

@Global()
@Module({
    imports: [UserModel, BlackListedTokensModel, EventsModule],
    providers: [UserRespository, BlackListedTokensRepository, TokenService, JwtService],
    exports: [UserModel, BlackListedTokensModel, UserRespository, BlackListedTokensRepository, TokenService, JwtService,EventsModule]
})
export class AuthenticationModule { }