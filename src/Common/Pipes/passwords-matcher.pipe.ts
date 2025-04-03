import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class PasswordsMatcherPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value.password !== value.cPassword) {
            throw new BadRequestException('Passwords do not match')
        }
        return value;
    }
}