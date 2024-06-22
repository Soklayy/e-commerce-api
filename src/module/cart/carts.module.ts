import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Carts } from './entities/carts.entity';
import { CartItems } from './entities/cart-items.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Product,Carts,CartItems])],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
