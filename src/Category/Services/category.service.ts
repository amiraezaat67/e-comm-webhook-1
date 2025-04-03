import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UploadApiOptions } from "cloudinary";
import { Types } from "mongoose";
import { CloudUploadFilesService } from "src/Common/Services";
import { CategoryType } from "src/DB/Models";
import { CategoryRepository } from "src/DB/Repositories";


@Injectable()
export class CategoryService {

    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly cloudUploadFilesService: CloudUploadFilesService
    ) { }

    async getCategoryById(_id) {
        return await this.categoryRepository.findOne({ filters: { _id } })
    }

    async UploadCategoryService({ file, public_id, folderId }: { file: Express.Multer.File, public_id?: string, folderId?: string }) {
        const image = file?.path
        if (image) {
            const categoryFolderId = folderId || Math.random().toString(36).slice(2, 9)

            const options: UploadApiOptions = { folder: `${process.env.CLOUDINARY_FOLDER}/Categories/${categoryFolderId}` }

            if (public_id) options.public_id = public_id

            const data = await this.cloudUploadFilesService.uploadFile(image, options)
            return { data: { ...data }, folderId: categoryFolderId }
        }
        return null
    }

    async CreateCategoryService({ name, authUser, file }) {

        const category = await this.categoryRepository.findOne({ filters: { name } })
        if (category) {
            throw new ConflictException('Category already exists')
        }

        const categoryObject: Partial<CategoryType> = {
            name,
            addedBy: authUser.user._id
        }
        if (file) {
            const uploadData = await this.UploadCategoryService({ file })
            if (uploadData) {
                categoryObject.image = uploadData.data
                categoryObject.folderId = uploadData.folderId
            }
        }

        const createdCategory = await this.categoryRepository.create(categoryObject)
        return createdCategory
    }


    async GetAllCategoryService() {
        return await this.categoryRepository.find()
    }

    async UpdateCategoryService({ _id, name, file }) {
        const category = await this.categoryRepository.findOne({ filters: { _id } })
        if (!category) {
            throw new NotFoundException('Category not found')
        }

        // Check name of category
        if (name) {
            const isNameExists = await this.categoryRepository.findOne({ filters: { name } })
            if (isNameExists) {
                throw new ConflictException('Category name already exists')
            }
            category.name = name
        }

        // Check image of category
        if (file) {
            const oldPublicId = category.image['public_id'].split(`${category.folderId}/`)[1]
            const uploadData = await this.UploadCategoryService({ file, public_id: `${oldPublicId}`, folderId: category.folderId })

            if (uploadData) {
                category.image = uploadData.data
                category.folderId = category.folderId
            }
        }
        const updatedCategory = await this.categoryRepository.saveToUpdate(category)
        return updatedCategory
    }

    async DeleteCategoryService(_id: string) {
        await this.categoryRepository.deleteCategoryWithRelatedDocs(Types.ObjectId.createFromHexString(_id))
        return { message: 'Category deleted' }
    }
}


/**
 * Categories APIs:
 * Get all categories
 * Get category by id
 * Update category image or name
 * Delete category
 * 
 * 
 * SubCategories APIs:
 * Get all subcategories
 * Get subcategory by id
 * Update subcategory image or name
 * Delete subcategory
 * 
 * 
 * Brands APIs:
 * Add brand
 * Get all brands
 * Get brand by id
 * Update brand image or name
 * Delete brand
 * 
 * 
 * Product APIs:
 * Add product
 * Get all products
 * Get product by id
 * Update product image or name
 * Delete product
 */