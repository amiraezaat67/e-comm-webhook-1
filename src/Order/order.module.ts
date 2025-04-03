import { Module } from "@nestjs/common";
import { OrderController } from "./Controllers/order.controller";
import { OrderService } from "./Services/order.service";
import { OrderRepository } from "src/DB/Repositories";
import { OrderModel } from "src/DB/Models";
import { CartModule } from "src/Cart/cart.module";
import { StripeService } from "./Payment/Services";




@Module({
    imports: [OrderModel, CartModule],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository, StripeService]
})
export class OrderModule { }
