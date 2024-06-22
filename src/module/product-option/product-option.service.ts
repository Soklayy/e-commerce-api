import { Injectable } from '@nestjs/common';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';
import { Repository } from 'typeorm';
import { ProductOption } from './entities/product-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductOptionService {
  constructor(
    @InjectRepository(ProductOption)
    private readonly productOptinRepo: Repository<ProductOption>,
  ) {}
  create(dto: CreateProductOptionDto) {
    return this.productOptinRepo.save(
      this.productOptinRepo.create({ ...dto}),
    );
  }

  findAll() {
    return this.productOptinRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} productOption`;
  }

  update(id: number, updateProductOptionDto: UpdateProductOptionDto) {
    return `This action updates a #${id} productOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} productOption`;
  }
}
