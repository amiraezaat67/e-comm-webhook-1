import { MiddlewareConsumer, Module, NestMiddleware, NestModule, RequestMethod } from "@nestjs/common";
import { CategoryController } from "./Controllers/category.controller";
import { CategoryService } from "./Services/category.service";
import { CategoryRepository, ProductRepository } from "src/DB/Repositories";
import { CategoryModel } from "src/DB/Models";
import { LoggerMiddleware } from "src/Common/Middlewares";
import { CloudUploadFilesService } from "src/Common/Services";
import { ProductModel } from "src/DB/Models/product.model";




@Module({
    imports: [CategoryModel,ProductModel],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryRepository, CloudUploadFilesService, ProductRepository],
    exports: []
})
export class CategoryModule {}