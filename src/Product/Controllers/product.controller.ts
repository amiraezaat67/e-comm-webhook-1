import { Body, Controller, Get, Post, Query, Req, Res, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ProductService } from "../Services/product.service";
import { CreateProductDto } from "../dto/product.dto";
import { Auth, AuthUser } from "src/Common/Decorators";
import { IAuthUser } from "src/Common/Types";
import { FilesInterceptor } from "@nestjs/platform-express";
import { UploadFileOptions } from "src/Common/Utils/multer.utils";
import { ImageMimeTypes } from "src/Common/Constants/constants";
import { Request, Response } from "express";


@Controller('products')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }


    @Post('create')
    @Auth('user')
    @UseInterceptors(FilesInterceptor('images', 3, UploadFileOptions({ allowedMimeTypes: ImageMimeTypes })))
    async CreateProduct(
        @Body() body: CreateProductDto,
        @AuthUser() authUser: IAuthUser,
        @Res() res: Response,
        @UploadedFiles() files?: Express.Multer.File[]
    ) {
        const result = await this.productService.CreateProductService({ body, authUser, files })
        res.status(201).json(result)
    }

    @Get('list')
    async GetAllProduct(
        @Req() req: Request
    ) {
        return await this.productService.ListProductService(req['parsedQuery'])
    }

    // async GetProductById() {
    //     return await this.productService.GetProductByIdService()
    // }

    // async UpdateProduct() {
    //     return await this.productService.UpdateProductService()
    // }

    // async DeleteProduct() {
    //     return await this.productService.DeleteProductService()
    // }
}
