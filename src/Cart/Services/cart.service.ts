import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IAuthUser } from "src/Common/Types";
import { CartRepository, ProductRepository } from "src/DB/Repositories";



@Injectable()
export class CartService {
    constructor(
        private readonly cartRepository: CartRepository,
        private readonly productRepository: ProductRepository
    ) { }

    async addToCart({ body, authUser }) {
        const { productId, quantity } = body
        const userId = authUser.user._id

        const product = await this.productRepository.findById(productId)
        if (!product) {
            throw new NotFoundException('Product not found')
        }

        const cart = await this.cartRepository.findOne({ filters: { userId } })
        if (!cart) {
            return await this.cartRepository.create({ userId, products: [{ id: productId, finalPrice: product.finalPrice, quantity }] })
        }

        const productInCart = cart.products.find(product => product.id.equals(productId))
        if (productInCart) throw new BadRequestException('Product already in cart')

        cart.products.push({ id: productId, finalPrice: product.finalPrice, quantity })

        return await cart.save()
    }

    async removeFromCart({ productId, authUser }) {
        const userId = authUser.user._id

        const product = await this.productRepository.findById(productId)
        if (!product) {
            throw new NotFoundException('Product not found')
        }

        const cart = await this.cartRepository.findOne({ filters: { userId, 'products.id': productId } })
        if (!cart || !cart?.products?.length) throw new NotFoundException('Empty or wrong cartId')

        cart.products = cart.products.filter(product => !product.id.equals(productId))
        if (!cart.products.length) return await this.cartRepository.deleteOne({ filters: { _id: cart._id } })

        return await cart.save()
    }

    async getCart(authUser: IAuthUser) {
        return await this.cartRepository.findOne({ filters: { userId: authUser.user._id }, select: 'products subTotal' })
    }

    async updateProductQuantity({ productId, quantity, authUser }) {

        const userId = authUser.user._id

        const product = await this.productRepository.findById(productId)
        if (!product) {
            throw new NotFoundException('Product not found')
        }

        const cart = await this.cartRepository.findOne({ filters: { userId, 'products.id': productId } })
        if (!cart || !cart?.products?.length) throw new NotFoundException('Empty or wrong cartId')

        cart.products.find(product => {
            if (product.id.equals(productId)) {
                product.quantity = quantity
                return product
            }
        })
        return await cart.save()
    }
}