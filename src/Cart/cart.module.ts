import { Module } from "@nestjs/common";
import { CartModel, ProductModel } from "src/DB/Models";
import { CartRepository, ProductRepository } from "src/DB/Repositories";
import { CartService } from "./Services/cart.service";
import { CartController } from "./Controllers/cart.controller";



@Module({
    imports: [CartModel, ProductModel],
    controllers: [CartController],
    providers: [CartRepository, ProductRepository, CartService],
    exports: [CartService, CartRepository, ProductRepository, ProductModel, CartModel]
})
export class CartModule { }
