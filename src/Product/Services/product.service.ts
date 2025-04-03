import { Injectable, NotFoundException } from "@nestjs/common";
import { UploadApiOptions } from "cloudinary";
import { Types } from "mongoose";
import { CategoryService } from "src/Category/Services/category.service";
import { CloudUploadFilesService } from "src/Common/Services";
import { ProductType } from "src/DB/Models/product.model";
import { ProductRepository } from "src/DB/Repositories";
import { ListProductDto } from "../dto/product.dto";
import { FiltersMapper } from "src/Common/Utils";



@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly cloudUploadFilesService: CloudUploadFilesService,
        private readonly categoryService: CategoryService
    ) { }

    async CreateProductService({ body, authUser, files }) {
        const { title, description, basePrice, discount, stock } = body
        const addedBy = authUser.user._id

        const categoryId = Types.ObjectId.createFromHexString(body.categoryId)
        const category = await this.categoryService.getCategoryById(categoryId)
        if (!category) {
            throw new NotFoundException('Category not found')
        }

        const productObject: Partial<ProductType> = {
            title,
            description,
            basePrice,
            discount,
            stock,
            addedBy,
            categoryId
        }

        if (files.length) {
            const categoryFodlerId = category.folderId
            const productFolderId = Math.random().toString(36).slice(2, 9)
            const options: UploadApiOptions = { folder: `${process.env.CLOUDINARY_FOLDER}/Categories/${categoryFodlerId}/Products/${productFolderId}` }
            const images = await this.cloudUploadFilesService.uploadFiles(files.map(file => file.path), options)
            productObject.images = images
            productObject.folderId = productFolderId
        }

        const createdProduct = await this.productRepository.create(productObject)
        return createdProduct
    }

    async ListProductService(query: ListProductDto) {
        const {
            page,
            limit,
            sort,
            ...filters
        } = query

        const parsedFilters = FiltersMapper(filters)
        if (parsedFilters.price) {
            parsedFilters.finalPrice = parsedFilters.price
            delete parsedFilters.price
        }

        const options = { skip: (+page - 1) * (+limit), limit: +limit, sort, populateArray: [{ path: 'categoryId' }] }

        return await this.productRepository.find({ filters: parsedFilters, ...options })
    }

}