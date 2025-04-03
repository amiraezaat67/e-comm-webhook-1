import { Module } from "@nestjs/common";
import { UserController } from "./Controllers/user.controller";
import { UserService } from "./Services/user.service";


@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService],
    exports: []
})
export class UserModule { }
