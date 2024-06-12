import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductSku } from '../entities/product-sku.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductSkuDto } from './dto/update-product-sku.dto';
import { CreateProductSkuDto } from './dto/create-product-sku.dto';

@Injectable()
export class ProductSkuService {
  constructor(
    @InjectRepository(ProductSku)
    private readonly productSkuRepo: Repository<ProductSku>,
  ) {}

  async create(createDto: CreateProductSkuDto) {
    try {
      const sku = new Date().getTime().toString(36);
      const productSku = this.productSkuRepo.create({ sku: sku, ...createDto });

      return this.productSkuRepo.save(productSku);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.productSkuRepo.find({
      select: {
        product: {
          id: true,
          name: true,
          summary: true,
        },
        size: {
          id: true,
          value: true,
        },
        color: {
          id: true,
          value: true,
        },
      },
      relations: {
        product: true,
        size: true,
        color: true,
      },
    });
  }

  async findOne(sku: string) {
    const productSku = await this.productSkuRepo.findOne({
      where: { sku },
      select: {
        product: {
          id: true,
          name: true,
          summary: true,
        },
        size: {
          id: true,
          value: true,
        },
        color: {
          id: true,
          value: true,
        },
      },
      relations: {
        product: true,
        size: true,
        color: true,
      },
    });

    if (!productSku) throw new NotFoundException();

    return productSku;
  }

  async update(sku: string, updateDto: UpdateProductSkuDto) {
    const exist = await this.productSkuRepo.countBy({ sku });
    if (exist <= 0) throw new NotFoundException();

    const updateResult = await this.productSkuRepo.update(
      { sku: sku },
      updateDto,
    );

    if (updateResult.affected <= 0)
      throw new BadRequestException('Invalid update product sku');

    return this.findOne(sku);
  }

  remove(sku: string) {}
}
