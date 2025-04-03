import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";



export class CreateOrderBodyDto {

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsEnum(['cash', 'card'])
    paymentMethod: string;
}