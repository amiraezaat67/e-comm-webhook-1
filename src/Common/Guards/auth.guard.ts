import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "../Services";
import { IAuthUser } from "../Types";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private tokenService: TokenService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        if (context['contextType'] == 'http') {
            const request = context.switchToHttp().getRequest()
            const { accesstoken } = request.headers
            if (!accesstoken) throw new UnauthorizedException('Please login')
            const { user, data } = await this.tokenService.validateAndVerifyToken(accesstoken)
            request.authUser = { user, token: data } as IAuthUser
            return true
        }

        return true
    }
}