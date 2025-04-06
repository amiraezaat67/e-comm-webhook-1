import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CartService } from "src/Cart/Services/cart.service";
import { CartRepository, OrderRepository } from "src/DB/Repositories";
import { StripeService } from "../Payment/Services";
import { Types } from "mongoose";
import { UserType } from "src/DB/Models";
import Stripe from "stripe";
// import { Order } from "src/GraphQl/Types/order.type";

@Injectable()
export class OrderService {

    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly cartService: CartService,
        private readonly stripeService: StripeService,
        private readonly cartRepository: CartRepository
    ) { }

    async createOrder({ order, user }) {
        const cart = await this.cartService.getCart(user)
        if (!cart) throw new NotFoundException('Cart not found')

        console.log(user.user._id);

        return await this.orderRepository.createOrder({ cart, userId: user.user._id.toString(), ...order })
    }

    async payWithCard({ orderId, user }: { orderId: Types.ObjectId, user: UserType }) {
        const { _id } = user
        // find pending order with orderId and user
        const order = await this.orderRepository.findOne({
            filters: { _id: orderId, userId: _id, orderStatus: 'pending' },
            populateArray: [
                {
                    path: 'cartId',
                    select: 'products',
                    populate: {
                        path: 'products.id',
                        select: 'title finalPrice images'
                    }
                }
            ]
        })
        if (!order) throw new NotFoundException('Order not found')

        const line_items = order.cartId['products'].map(item => ({
            price_data: {
                currency: 'EGP',
                product_data: {
                    name: item.id.title,
                    images: [item.id.images[0]?.secure_url]
                },
                unit_amount: item.id.finalPrice * 100,
            },
            quantity: item.quantity,
        }))


        // create coupon
        const coupon = await this.stripeService.createCoupon({
            name: 'Test Coupon-50',
            // amount_off: 100 * 100,
            percent_off: 50,
            // currency: 'EGP'
        })
        console.log(coupon);

        // create checkout session
        return await this.stripeService.createCheckoutSession({
            line_items,
            customer_email: user.email,
            discounts: [{ coupon: coupon.id }],
            metadata: { orderId: orderId.toString() }
        })
    }

    async handleStripeWebhook(body: Stripe.Event) {

        const payment_intent = body.data.object['payment_intent']

        const paymentIntent = await this.stripeService.retrievePaymentIntent(payment_intent)

        if (paymentIntent.status == 'succeeded') {

            await this.orderRepository.updateOne(
                {
                    filters: { _id: body.data.object['metadata'].orderId },
                    update: { orderStatus: 'paid', orderChanges: { paidAt: new Date() }, paymentIntentId: paymentIntent.id }
                })

            // update the cart and make it empty products array
            this.cartRepository.updateOne({
                filters: { userId: body.data.object['metadata'].userId },
                update: { products: [], subTotal: 0 }
            })
        }

        return true
    }

    async cancelOrder({ orderId, user }: { orderId: Types.ObjectId, user: UserType }) {
        // user can cancel order after 1 day of order creation
        const order = await this.orderRepository.findOne({
            filters: { _id: orderId, userId: user._id },
            populateArray: [
                {
                    path: 'cartId',
                    select: 'products',
                    populate: {
                        path: 'products.id',
                        select: 'title finalPrice images'
                    }
                }
            ]
        })
        if (!order) throw new NotFoundException('Order not found')

        if (!['pending', 'paid', 'placed'].includes(order.orderStatus)) throw new BadRequestException('Order is not placed to be cancelled')

        const timeDiff = new Date().getTime() - order['createdAt'].getTime()
        console.log(timeDiff);

        const diffInDays = timeDiff / (1000 * 60 * 60 * 24)
        console.log(diffInDays);

        if (diffInDays > 1) throw new BadRequestException('Order can only be cancelled within 1 day of creation')


        await this.orderRepository.updateOne({
            filters: { _id: orderId, userId: user._id },
            update: { orderStatus: 'cancelled', orderChanges: { cancelledAt: new Date(), cancelledBy: user._id } }
        })

        // apply automatic refund
        if (order?.paymentMethod == 'card') {
            const refund = await this.stripeService.refundTransaction({ paymentIntentId: order.paymentIntentId, reason: 'requested_by_customer' })
            console.log(refund);

            await this.orderRepository.updateOne({
                filters: { _id: orderId, userId: user._id },
                update: { orderStatus: 'refunded', orderChanges: { refundedAt: new Date(), refundedBy: user._id } }
            })
        }

        return 'Order cancelled if you pay with card please check your bank account for refund'
    }


    async listOrders()  {
        return await this.orderRepository.find({})
    }
}