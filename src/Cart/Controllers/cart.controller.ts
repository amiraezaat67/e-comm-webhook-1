import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { CartService } from "../Services/cart.service";
import { AddToCartDto } from "../dto/cart.dto";
import { IAuthUser } from "src/Common/Types";
import { Auth, AuthUser } from "src/Common/Decorators";



@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { }

    @Post('add-to-cart')
    @Auth('user')
    async addToCart(
        @Body() body: AddToCartDto,
        @AuthUser() authUser: IAuthUser
    ) {
        return await this.cartService.addToCart({ body, authUser })
    }

    @Patch('remove-from-cart/:productId')
    @Auth('user')
    async removeFromCart(
        @Param('productId') productId: string,
        @AuthUser() authUser: IAuthUser
    ) {
        return await this.cartService.removeFromCart({ productId, authUser })
    }

    @Get('get-cart')
    @Auth('user')
    async getCart(
        @AuthUser() authUser: IAuthUser
    ) {
        const cart = await this.cartService.getCart(authUser)
        if (!cart) return new NotFoundException('Cart not found')
        return cart
    }

    @Patch('update-quantity/:productId')
    @Auth('user')
    async updateCart(
        @Param('productId') productId: string,
        @Body('quantity') quantity: number,
        @AuthUser() authUser: IAuthUser
    ) {
        if (quantity < 1) return new BadRequestException('Quantity must be greater than 0')
        return await this.cartService.updateProductQuantity({ productId, quantity, authUser })
    }
}
