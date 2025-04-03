import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './User/user.module';
import { AuthenticationModule } from './DB/db.module';
import { CategoryModule } from './Category/category.module';
import { LoggerMiddleware } from './Common/Middlewares';
import { ProductModule } from './Product/product.module';
import { CartModule } from './Cart/cart.module';
import { OrderModule } from './Order/order.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    AuthenticationModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
// Global middleware if it class
export class AppModule{}
//  implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes({
//       path: '*',
//       method: RequestMethod.ALL
//     })
//   }
// }
