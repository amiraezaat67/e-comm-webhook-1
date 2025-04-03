import { IsMongoId, IsNotEmpty, IsNumber, Min } from "class-validator"
import { Types } from "mongoose"



export class AddToCartDto {
    @IsMongoId()
    @IsNotEmpty()
    productId: Types.ObjectId

    @IsNumber()
    @Min(1)
    quantity: number
}

export class RemoveFromCartDto {
    @IsMongoId()
    @IsNotEmpty()
    productId: Types.ObjectId
}

export class UpdateCartDto {

    @IsMongoId()
    @IsNotEmpty()
    productId: Types.ObjectId

    @IsNumber()
    @Min(1)
    quantity: number
}
