import { Request } from "express"
import { diskStorage } from "multer"



export const UploadFileOptions = ({
    path = 'General',
    allowedMimeTypes
}) => {

    const storage = diskStorage({})

    const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'), false)
        }
    }

    return {
        fileFilter,
        storage
    }
}