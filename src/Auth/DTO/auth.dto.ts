import { Type } from "class-transformer";
import { IsDate, IsDateString, isDateString, IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";
import { GenderEnum, RolesEnum } from "src/Common/Types";


export class SignUpBodyDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    firstName: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsEnum(RolesEnum)
    role: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsEnum(GenderEnum)
    gender: string;

    // @IsDate()
    // @Type(() => Date) 
    @IsDateString()
    DOB: Date;
}


export class SignInBodyDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    password: string;
}


export class ConfirmEmailBodyDto {
    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}
