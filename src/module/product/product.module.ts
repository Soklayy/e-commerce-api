import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductSku } from './entities/product-sku.entity';
import { ProductAttribute } from './entities/product-attribute.entity';
import { ProductAttributesController } from './product-attributes/product-attributes.controller';
import { ProductAttributesService } from './product-attributes/product-attributes.service';
import { ProductSkuController } from './product-sku/product-sku.controller';
import { ProductSkuService } from './product-sku/product-sku.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductSku, ProductAttribute]),
    FileModule,
  ],
  controllers: [
    ProductController,
    ProductAttributesController,
    ProductSkuController,
  ],
  providers: [ProductService, ProductAttributesService, ProductSkuService],
})
export class ProductModule {}
