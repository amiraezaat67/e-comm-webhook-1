import { config } from 'dotenv';
config()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MeasurementInterceptor, ResponseInterceptor } from './Common/Interceptors';
import * as qs from 'qs';
import { NextFunction, Request, Response } from 'express';
import { RequestQueryParser } from './Common/Middlewares';

async function bootstrap() {
   const app = await NestFactory.create(AppModule);
   app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
   app.useGlobalInterceptors(new ResponseInterceptor(), new MeasurementInterceptor())

   // app.use(new LoggerMiddleware())
   
   // Enable automatic parsing like Express
   app.use(RequestQueryParser);
   const port = process.env.PORT ?? 3000
   await app.listen(port, () => console.log(`Server is running on port ${port}`));
}
bootstrap();


/***
============================================ Models ============================================
  * User Model
  * CategoryAndSubcategory Model
  * Brand Model
  * Product Model
  * Order Model
  * Cart Model
  * Wishlist Model
  * Payment Model
  * Review Model
  * Address Model
  * Coupon Model
  * BlackListedTokens Model
  * OTP Model
  
  * User model:
    - firstName
    - lastName
    - email [unique] [create index to this field for quick search with it]
    - password
    - phone
    - role
    - gender
    - DOB
    - isEmailVerified
    - isDeleted

  * Categoris model:
    - name [unique] [create index to this field for quick search with it]
    - slug
    - image
    - addedBy [ref to User collectinon]
    - isDeleted
    - refToCategoryId [ref to category collectinon]
    - isSubCategory[ create index to this field for quick search with it  ]

  * Brand model:
    - name [unique] [create index to this field for quick search with it]
    - slug
    - brandOwner [ref to User collectinon]
    - logo
    - isDeleted

  * Product model:
    - name [unique] [create index to this field for quick search with it]
    - description
    - slug
    - images
    - basePrice
    - discount
    - finalPrice
    - stock
    - overAllRating 
    - addedBy [ref to User collectinon]
    - brand [ref to Brand collection]
    - category [ref to Category collection]
    - subCategory [ref to SubCategory collection]
    - isDeleted
  
  * BlackListedTokens:
    - tokenId
    - userId [ref to User collection]
    - expiryTime 
  
  * OTP:
    - otp
    - userId [ref to User collection]
    - expiryTime
    - otpType ["confirm_email", "reset_password"]
============================================ APIs ============================================
 * User: 
    * Confirm email
    * Refresh Token API
    * Log out API
    * Forget Password
    * Reset Password
    * Get profile data
    * Update profile
    * Update Password

 * Category:
    * Get all categories with the subcategories
    * Get single category with the subcategories
    * Create category
    * Update category
    * Delete category [delete all subcategories related to this category]
    * Same APIs for SubCategory

 * Brand:
    * Get all brands
    * Get single brand
    * Create brand
    * Update brand
    * Delete brand
  
  * Product:
    * Get all products
    * Get single product
    * Create product
    * Update product
    * Delete product

 * Order:
    * Get all orders
    * Get single order
    * Create order
    * Update order
    * Delete order

 * Cart:
    * Get all carts
    * Get single cart
    * Create cart
    * Update cart
    * Delete cart

 * Wishlist:
    * Get all wishlists
    * Get single wishlist
    * Create wishlist
    * Update wishlist
    * Delete wishlist

 * Payment:
    * Get all payments
    * Get single payment
    * Create payment
    * Update payment
    * Delete payment

 * Review:
    * Get all reviews
    * Get single review
    * Create review
    * Update review
    * Delete review

 * Address:
    * Get all addresses
    * Get single address
    * Create address
    * Update address
    * Delete address

 * Coupon:
    * Get all coupons
    * Get single coupon
    * Create coupon
    * Update coupon
    * Delete coupon
 */