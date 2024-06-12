import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAttribute } from '../entities/product-attribute.entity';
import { Repository } from 'typeorm';
import { CreateProductAttributeDto } from './dto/create-product-atrribute.dto';
import { UpdateProductAtrributeDto } from './dto/update-product-atrribute.dto';

@Injectable()
export class ProductAttributesService {
  constructor(
    @InjectRepository(ProductAttribute)
    private readonly productAtrributeRepo: Repository<ProductAttribute>,
  ) {}

  async create(createProductAttributeDto: CreateProductAttributeDto) {
    try {
      const atrribute = this.productAtrributeRepo.create(
        createProductAttributeDto,
      );
      return this.productAtrributeRepo.save(atrribute);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return this.productAtrributeRepo.find({});
  }

  async findOne(id: string) {
    const productAttr = await this.productAtrributeRepo.findOne({
      where: { id },
    });
    if (!productAttr) throw new NotFoundException();
    return productAttr;
  }

  async update(
    id: string,
    updateProductAttributeDto: UpdateProductAtrributeDto,
  ) {
    try {
      const productAttr = await this.findOne(id);
      Object.assign(productAttr, updateProductAttributeDto);
      return this.productAtrributeRepo.save(productAttr);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const productAttr = await this.findOne(id);
      await this.productAtrributeRepo.remove(productAttr);
      return {
        message: 'success',
      };
    } catch (error) {
      throw error;
    }
  }
}
