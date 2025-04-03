import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { CategoryService } from "../Services/category.service";
import { Auth, AuthUser } from "src/Common/Decorators";
import { IAuthUser } from "src/Common/Types";
import { CategoryResponseInterceptor } from "src/Common/Interceptors";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadFileOptions } from "src/Common/Utils/multer.utils";
import { ImageMimeTypes } from "src/Common/Constants/constants";

@Controller('category')
export class CategoryController {

    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post('create')
    @Auth('user')
    // @HttpCode(200)
    @UseInterceptors(FileInterceptor('file', UploadFileOptions({ path: 'Category', allowedMimeTypes: ImageMimeTypes })))
    async CreateCategoryHandler(
        @Body('name') name: string,
        @AuthUser() authUser: IAuthUser,
        // @Res() res: Response,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const result = await this.categoryService.CreateCategoryService({ name, authUser, file })
        // res.status(201).json({ message: 'Category created', result })
        return { message: 'Category created', result , statusCode: 201 }
    }

    @Put('update/:_id')
    @Auth('user')
    @UseInterceptors(FileInterceptor('file', UploadFileOptions({ path: 'Category', allowedMimeTypes: ImageMimeTypes })))
    async UpdateCategoryHandler(
        @Param('_id') _id: string,
        @Body('name') name: string,
        @Res() res: Response,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const result = await this.categoryService.UpdateCategoryService({ _id, name, file })
        res.status(200).json({ message: 'Category updated', result })
    }

    @Delete('delete/:_id')
    @Auth('user')
    async DeleteCategoryHandler(@Param('_id') _id: string, @Res() res: Response) {
        const result = await this.categoryService.DeleteCategoryService(_id)
        res.status(200).json({ message: 'Category deleted', result })
    }


    @Get('all')
    @UseInterceptors(CategoryResponseInterceptor)
    async GetAllCategoryHandler() {
        const result = await this.categoryService.GetAllCategoryService()
        return { message: 'Categories', result }
    }

    @Get('getById/:_id')
    async GetCategoryByIdHandler(@Param('_id') _id: string) {
        const result = await this.categoryService.getCategoryById(_id)
        return { message: 'Category', result }
    }
}
