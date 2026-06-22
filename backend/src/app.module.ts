import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module'; // 1. Make sure this is imported

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://configurator-mongodb:27017/product-configurator'),
    ProductsModule, // 2. Make sure this is right here!
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}