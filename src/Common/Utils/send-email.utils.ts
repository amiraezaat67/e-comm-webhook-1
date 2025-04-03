import * as nodemailer from 'nodemailer'
import { EventEmitter } from 'node:events'
export const Events = new EventEmitter()

export const SendEmail = async (mailOptions: nodemailer.SendMailOptions) => {
    try {
        const transport: nodemailer.Transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: +(process.env.EMAIL_PORT as string),
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })
        await transport.sendMail(mailOptions)

        console.log('Email sent successfully');
        return true

    } catch (error) {
        console.log('Failed to send email', error);
        throw new Error('Failed to send email')
    }
}


Events.on('sendEmail', (data) => {
    SendEmail(data)
})