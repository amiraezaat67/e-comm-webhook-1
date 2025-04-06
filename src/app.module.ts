import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './Auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './User/user.module';
import { CategoryModule } from './Category/category.module';
import { ProductModule } from './Product/product.module';
import { CartModule } from './Cart/cart.module';
import { OrderModule } from './Order/order.module';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// import { join } from 'path';
import { GlobalModule } from './gloabal.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL as string),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    // }),
    GlobalModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// Global middleware if it class
export class AppModule { }
//  implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes({
//       path: '*',
//       method: RequestMethod.ALL
//     })
//   }
// }
