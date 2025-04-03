import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { BlackListedTokensRepository, OtpRepository, UserRespository } from "src/DB/Repositories";
import { ConfirmEmailBodyDto, SignInBodyDto, SignUpBodyDto } from "../DTO/auth.dto";
import { Events } from "src/Common/Utils";
import { CompareHashed } from "src/Common/Security";
import { TokenService } from "src/Common/Services";
import { v4 as uuid4 } from 'uuid'
import { UserType } from "src/DB/Models/user.model";
import { IAuthUser, OTPTypeEnum } from "src/Common/Types";
import { Types } from "mongoose";
@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRespository,
        private readonly otpRepository: OtpRepository,
        private readonly blackListedTokensRepository: BlackListedTokensRepository,
        private readonly tokenService: TokenService
    ) { }


    async SignUpService(body: SignUpBodyDto) {

        const { firstName, lastName, email, password, role, phone, gender, DOB } = body

        // check if email already exist
        const user = await this.userRepository.findByEmail(email)
        if (user) {
            throw new ConflictException('User already exists')
        }

        const newUser = await this.userRepository.create({
            firstName,
            lastName,
            email,
            password,
            role,
            phone,
            gender,
            DOB
        })

        //send otp and store this otp on otp model [hashed]
        const otp = Math.random().toString().slice(2, 8)
        await this.otpRepository.createOtp(newUser._id, otp, OTPTypeEnum.CONFIRM_EMAIL)

        Events.emit('sendEmail', {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for signup',
            html: `Your OTP is ${otp}`
        })

        return newUser
    }


    async ConfirmEmailService(body: ConfirmEmailBodyDto) {
        const { otp, email } = body

        // find user by email
        const user = await this.userRepository.findByEmail(email)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        //find otp
        const otpData = await this.otpRepository.findOne({ filters: { userId: user._id, otpType: OTPTypeEnum.CONFIRM_EMAIL } })
        //check if otp is correct
        if (!otpData || !CompareHashed(otp, otpData.otp)) {
            throw new BadRequestException('Wrong OTP')
        }

        //check if otp is expired
        const isOtpExpired = otpData.expiryTime < new Date()
        if (isOtpExpired) {
            throw new BadRequestException('OTP expired')
        }

        //update user to verified the email
        user.isEmailVerified = true
        await this.userRepository.saveToUpdate(user)

        //delete otp
        await this.otpRepository.deleteOne({ filters: { _id: otpData._id } })
        return user
    }


    async LoginService(body: SignInBodyDto) {
        try {
            const { email, password } = body

            const user = await this.userRepository.findByEmail(email)
            if (!user || !CompareHashed(password, user.password)) {
                throw new NotFoundException('User not found')
            }
            const tokenPayload = {
                _id: user._id,
                email: user.email,
                role: user.role
            }

            console.log(process.env.EXPIRATION_ACCESS_TOKEN);
            
            const accesstoken = this.tokenService.generate(
                tokenPayload,
                {
                    secret: process.env.ACCESS_TOKEN_SECRET,
                    expiresIn: process.env.EXPIRATION_ACCESS_TOKEN as string,
                    jwtid: uuid4()
                }
            )

            const refershToken = this.tokenService.generate(
                tokenPayload,
                {
                    secret: process.env.REFRESH_TOKEN_SECRET,
                    expiresIn: process.env.EXPIRATION_REFRESH_TOKEN,
                    jwtid: uuid4()
                }
            )
            return { accesstoken, refershToken }
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async LogoutService(authUser: IAuthUser) {
        console.log(authUser);

        await this.blackListedTokensRepository.create({
            token: authUser.token['jti'],
            userId: authUser.user._id,
            expiryTime: authUser.token['exp']
        })

        return 'Logged out successfully'
    }
}