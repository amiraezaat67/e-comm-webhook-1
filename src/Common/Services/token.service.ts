import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt'
import { BlackListedTokensRepository, UserRespository } from "src/DB/Repositories";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRespository,
        // inject blacklisted tokens repository 
        // Use forwardRef to avoid circular dependency because BlackListedTokensRepository depends on TokenService
        @Inject(forwardRef(() => BlackListedTokensRepository))
        private blackListedTokensRepository: BlackListedTokensRepository,
    ) { }


    generate(payload, options?: JwtSignOptions): string {
        return this.jwtService.sign(payload, options)
    }

    verify(token: string, options?: JwtVerifyOptions) {
        return this.jwtService.verify(token, options)
    }

    async validateAndVerifyToken(accesstoken: string) {

        let data
        try {
            data = this.verify(accesstoken, { secret: process.env.ACCESS_TOKEN_SECRET })
        } catch (error) {
            throw new UnauthorizedException(error.message)
        }
        // check if token is not blacklisted
        const blacklistedToken = await this.blackListedTokensRepository.findOne({ filters: { token: data.jti } })
        if (blacklistedToken) throw new UnauthorizedException('Your token is expired')

        const user = await this.userRepository.findOne({ filters: { _id: data._id } })
        if (!user) throw new NotFoundException('Please register ')

        return { user, data }
    }
}
