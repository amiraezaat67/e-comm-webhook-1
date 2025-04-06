import { Global, Module } from "@nestjs/common";
import { BlackListedTokensModel, UserModel } from "./DB/Models";
import { EventsModule, RealTimeEventsGateway } from "./Common/gateways";
import { BlackListedTokensRepository, UserRespository } from "./DB/Repositories";
import { TokenService } from "./Common/Services";
import { JwtService } from "@nestjs/jwt";

@Global()
@Module({
    imports: [UserModel, BlackListedTokensModel],
    providers: [UserRespository, BlackListedTokensRepository, TokenService, JwtService, RealTimeEventsGateway],
    exports: [UserModel, BlackListedTokensModel, UserRespository, BlackListedTokensRepository, TokenService, JwtService, RealTimeEventsGateway]
})
export class GlobalModule { }