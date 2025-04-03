import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { encrypt, Hash } from "src/Common/Security";
import { GenderEnum, RolesEnum } from "src/Common/Types";

@Schema({ timestamps: true })
export class User {

    @Prop({
        type: String,
        required: true,
        lowercase: true,
        trim: true
    })
    firstName: string;


    @Prop({
        type: String,
        required: true,
        lowercase: true,
        trim: true
    })
    lastName: string;

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        type: String,
        required: true,
    })
    password: string;

    @Prop({
        type: Date
    })
    DOB: Date;

    @Prop({
        type: String
    })
    phone: string;

    @Prop({
        type: Boolean,
        default: false
    })
    isEmailVerified: boolean;

    @Prop({
        type: String,
        enum: RolesEnum,
        default: RolesEnum.USER
    })
    role: string;

    @Prop({
        type: Boolean,
        default: false
    })
    isDeleted: boolean;

    @Prop({
        type: String,
        enum: GenderEnum
    })
    gender: string;

}

const userschema = SchemaFactory.createForClass(User)

userschema.pre('save', async function () {
    const changes = this.getChanges()['$set']
    if (changes.password) {
        this.password = Hash(this.password)
    }
    if (changes.phone) {
        this.phone = encrypt(this.phone, process.env.ENCRYT_KEY as string)
    }
})

export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: userschema }])

export type UserType = HydratedDocument<User> & Document