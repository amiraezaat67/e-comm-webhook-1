
import * as bcrypt from 'bcrypt'


export const Hash = (plainText: string, saltRound: number = +(process.env.SALT_ROUND as string)): string => {
    return bcrypt.hashSync(plainText, saltRound)
}


export const CompareHashed = (plainText: string, hash: string): boolean => {
    return bcrypt.compareSync(plainText, hash)
}