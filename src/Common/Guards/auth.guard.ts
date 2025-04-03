import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { TokenService } from "../Services";
import { BlackListedTokensRepository, UserRespository } from "src/DB/Repositories";
import { IAuthUser } from "../Types";


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private tokenService: TokenService,
        private readonly userRepository: UserRespository,
        private readonly blackListedTokensRepository: BlackListedTokensRepository
    ) { }


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        const { accesstoken } = request.headers
        if (!accesstoken) throw new UnauthorizedException('Please login')

        let data
        try {
            data = this.tokenService.verify(accesstoken, { secret: process.env.ACCESS_TOKEN_SECRET })
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }
        // check if token is not blacklisted
        const blacklistedToken = await this.blackListedTokensRepository.findOne({ filters: { token: data.jti } })
        if (blacklistedToken) throw new UnauthorizedException('Your token is expired')

        const user = await this.userRepository.findOne({ filters: { _id: data._id } })
        if (!user) throw new NotFoundException('Please register ')

        request.authUser = { user, token: data } as IAuthUser
        return true
    }
}