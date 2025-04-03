import { Body, Controller, Post } from "@nestjs/common";
import { OrderService } from "../Services/order.service";
import { Auth, AuthUser } from "src/Common/Decorators";
import { IAuthUser } from "src/Common/Types";
import { CreateOrderBodyDto } from "../dto/order.dto";
import { Types } from "mongoose";
import Stripe from "stripe";


@Controller('order')
export class OrderController {

    constructor(
        private readonly orderService: OrderService
    ) { }


    @Post('create')
    @Auth('user')
    async createOrder(
        @AuthUser() user: IAuthUser,
        @Body() order: CreateOrderBodyDto
    ) {
        console.log(user);

        return await this.orderService.createOrder({ order, user })
    }

    @Post('pay')
    @Auth('user')
    async payWithCard(
        @AuthUser() AuthUser: IAuthUser,
        @Body('orderId') orderId: Types.ObjectId
    ) {
        return await this.orderService.payWithCard({ orderId, user: AuthUser.user })
    }

    @Post('webhook')
    async webhookHandler(
        @Body() body: Stripe.Event
    ) {
        return await this.orderService.handleStripeWebhook(body)
    }

    @Post('cancel')
    @Auth('user')
    async cancelOrder(
        @AuthUser() AuthUser: IAuthUser,
        @Body('orderId') orderId: Types.ObjectId
    ) {
        return await this.orderService.cancelOrder({ orderId, user: AuthUser.user })
    }
}

