import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MinLength } from "class-validator";
import { RolesEnum } from "src/Common/Types";


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
}


export class SignInBodyDto {



    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword()
    password: string;

}