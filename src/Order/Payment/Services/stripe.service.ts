import { Injectable } from "@nestjs/common";
import Stripe from 'stripe';

const secret = 'sk_test_51Njrk3F3j5J0xdEHN7Oe7QGEODHS4VtI9mDfKlkgwbEKXm3mrqN7cGH2CNQq9lEZBhBSmwCR2TlyYqfUzGKnaBvN00ZDWAjwW7'

@Injectable()
export class StripeService {
    private stripeConnection = new Stripe(secret)


    async createCheckoutSession({
        line_items,
        discounts = [],
        customer_email,
        metadata
    }: Stripe.Checkout.SessionCreateParams) {
        return await this.stripeConnection.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: 'http://localhost:5000/order/success',
            cancel_url: 'http://localhost:3000/cancel',
            line_items,
            discounts,
            customer_email,
            metadata
        })
    }

    async createCoupon({
        name,
        amount_off,
        percent_off,
        currency,
    }: Stripe.CouponCreateParams) {
        return await this.stripeConnection.coupons.create({
            name,
            amount_off,
            percent_off,
            currency,
        })
    }

    async retrieveCoupon(id: string) {
        return await this.stripeConnection.coupons.retrieve(id)
    }

    async confirmPaymentIntnet(paymentIntentId: string) {
        return await this.stripeConnection.paymentIntents.confirm(paymentIntentId)
    }

    async retrievePaymentIntent(paymentIntentId: string) {
        return await this.stripeConnection.paymentIntents.retrieve(paymentIntentId)
    }

    async refundTransaction({ paymentIntentId, reason }) {
        return await this.stripeConnection.refunds.create({
            payment_intent: paymentIntentId,
            reason
        })
    }

}


/**
 * line_items:[{
 *      price_data:{
 *          currency: string;
 *          product_data:{
 *              name: string;
 *              description: string;
 *              images: string[];
 *          }
 *          unit_amount: number;
 *      },
 *      quantity: number;
 * }]
 */