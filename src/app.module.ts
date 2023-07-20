import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb+srv://robin:${process.env.DB_Password}@cluster0.mjyafms.mongodb.net/${process.env.App_Mode}`,
    ),
    ProductsModule,
    CartModule,
  ],
})
export class AppModule {}
