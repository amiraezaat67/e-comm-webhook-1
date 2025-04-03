import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodSchema } from "zod";


export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const result = this.schema.parse(value)
            return result
        } catch (error) {
            throw new BadRequestException(error)
        }
    }
}