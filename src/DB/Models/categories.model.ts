import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User } from ".";
import { CloudUploadFilesService } from "src/Common/Services";


@Schema({ timestamps: true })
export class Category {
    @Prop({ type: String, required: true, index: { name: 'category_name_idx', unique: true } })
    name: string;

    @Prop({ type: String, required: true, default: function () { return slugify(this.name.toLowerCase()) } })
    slug: string;

    @Prop({ type: { secure_url: { type: String }, public_id: { type: String } } })
    image: object;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    addedBy: string | Types.ObjectId

    @Prop({ type: String })
    folderId: string
}

const categorySchema = SchemaFactory.createForClass(Category)

// Post delete hook
const cloudUploadFilesService = new CloudUploadFilesService()

categorySchema.post(['deleteOne', 'deleteMany', 'findOneAndDelete'], async (doc) => {
    if (doc.image) {
        await cloudUploadFilesService.deleteFolderByFolderPrefix(`${process.env.CLOUDINARY_FOLDER}/Categories/${doc.folderId}`)
    }
})

// model
export const CategoryModel = MongooseModule.forFeature([{ name: Category.name, schema: categorySchema }])

export type CategoryType = HydratedDocument<Category> & Document
