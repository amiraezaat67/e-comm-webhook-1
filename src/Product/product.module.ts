import { Module } from "@nestjs/common";
import { ProductController } from "./Controllers/product.controller";
import { ProductService } from "./Services/product.service";
import { CategoryService } from "src/Category/Services/category.service";
import { CategoryRepository, ProductRepository } from "src/DB/Repositories";
import { CloudUploadFilesService } from "src/Common/Services";
import { ProductModel } from "src/DB/Models/product.model";
import { CategoryModel } from "src/DB/Models";



@Module({
    imports: [ProductModel, CategoryModel],
    controllers: [ProductController],
    providers: [ProductService, CategoryService, ProductRepository  , CategoryRepository, CloudUploadFilesService]
})
export class ProductModule { }
