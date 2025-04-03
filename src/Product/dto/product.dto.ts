import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Validate, validate } from "class-validator";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { SortOrder, Types } from "mongoose";

@ValidatorConstraint({ name: 'discount-base-price', async: false })
export class DiscountLessThanBasePriceValidator implements ValidatorConstraintInterface {
    validate(discount: number, data: ValidationArguments) {
        return discount <= data.object['basePrice']
    }

    defaultMessage(): string {
        return 'Discount should be less than or equal to base price'
    }
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumberString()
    // @Type(() => Number)
    @IsNotEmpty()
    basePrice: number;

    // @IsNumber()
    // @Type(() => Number)
    @IsNumberString()
    @Validate(DiscountLessThanBasePriceValidator)
    @IsOptional()
    discount: number;

    // @IsNumber()
    // @Type(() => Number)
    @IsNumberString()
    @IsNotEmpty()
    stock: number;

    @IsMongoId()
    @Type(() => Types.ObjectId)
    categoryId: string;
}


export class ListProductDto {
    filters: object;

    @IsNumberString()
    page: number;

    @IsNumberString()
    limit: number;

    @IsString()
    sort: { [key: string]: SortOrder };
}