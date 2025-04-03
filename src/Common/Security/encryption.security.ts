import * as CryptoJS from 'crypto-js'


export const encrypt = (plainText: string, secretKey: string): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(plainText), secretKey).toString();
}

export const decrypt = (encryptedText: string, secretKey: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}