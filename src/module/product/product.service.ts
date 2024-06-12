import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { File } from '../file/entities/file.entity';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { PRODUCT_PAGINATION_CONFIG } from './dto/pagination.config';
import { selectPagination } from 'src/commons/utils';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly fileService: FileService,
  ) { }

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File) {
    let cover: File | null = null;
    try {
      if (file) {
        cover = await this.fileService.create(file);
      }
      const product = this.productRepo.create({ ...createProductDto, cover });
      return await this.productRepo.save(product);
    } catch (error) {
      if (cover) {
        await this.fileService.delete(cover.id);
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Product>> {
    selectPagination(query, PRODUCT_PAGINATION_CONFIG);
    return await paginate(query, this.productRepo, PRODUCT_PAGINATION_CONFIG);
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({
      where: {
        id,
      },
      relations: {
        cover: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    let cover: File | null = null;
    try {
      const product = await this.findOne(id);

      if (file) {
        if (product?.cover) {
          await this.fileService.update(product.cover.id, file);
        } else {
          cover = await this.fileService.create(file);
          product.cover = cover;
        }
      }

      Object.assign(product, updateProductDto);
      return this.productRepo.save(product);
    } catch (error) {
      if (cover) {
        await this.fileService.delete(cover.id);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      await this.productRepo.remove(product);

      if (product.cover) {
        await this.fileService.delete(product.cover.id);
      }

      return {
        message: 'Successfull',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
