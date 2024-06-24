import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
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

  private readonly logger = new Logger(Product.name);

  async create(createProductDto: CreateProductDto, files?: Express.Multer.File[]) {
    let images: Partial<File>[] | null = null;
    try {
      if (files) {
        images = await this.uploadImages(files)
      }
      const product = this.productRepo.create({
        ...createProductDto,
        brand: { id: createProductDto.brandId },
        category: { id: createProductDto.categoryId },
        images,
      });
      return await this.productRepo.save(product);
    } catch (error) {
      if (images) {
        this.deletedImages(images)
      }

      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException();
    }
  }

  async findAll(query: PaginateQuery) {
    selectPagination(query, PRODUCT_PAGINATION_CONFIG);
    const data = await paginate(
      query,
      this.productRepo,
      PRODUCT_PAGINATION_CONFIG,
    );
    return data;
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({
      where: {
        id,
      },
      relations:{
        category:true,
        brand:true,
      }
    });

    if (!product) throw new NotFoundException('Product not found');
    return product
  }

  async findOneById(id: string) {
    const product = await this.productRepo.findOne({
      where: {
        id,
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await this.findOneById(id);

      Object.assign(product, {
        ...updateProductDto,
        category: { id: updateProductDto?.categoryId },
        brand: { id: updateProductDto?.brandId },
      });
      return this.productRepo.save(product);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOneById(id);
      await this.productRepo.remove(product);

      if (product?.images) {
        await this.deletedImages(product.images)
      }

      return {
        message: 'Successfull',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addImage(id: string, files: Express.Multer.File[]) {
    const images: Partial<File>[] = [];
    try {
      const product = await this.findOneById(id);
      if (product.images?.length < 4) {
        images.push(
          ...(await this.uploadImages(files, 4 - product.images?.length)),
        );
      } else {
        throw new BadRequestException('Only 4 images in the product sku');
      }

      product.images = [...product.images, ...images];

      const result = await this.productRepo.save(product);

      return {
        message: 'Images added successfully',
        images: result.images,
      };
    } catch (error) {
      //deleted images
      if (images?.length > 0) {
        this.deletedImages(images);
      }

      // throw exception
      if (error instanceof HttpException) throw error;
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateImage(id: string, imageId: string, file: Express.Multer.File) {
    const productSku = await this.productRepo.findOneBy({ id });
    const image = productSku?.images?.filter((image) => image.id == imageId);

    if (!productSku || image?.length <= 0) {
      throw new NotFoundException();
    }

    await this.fileService.update(imageId, file);
    return {
      message: 'Image updated successfully',
      image: image,
    };
  }

  async removeImage(id: string, imageId: string) {
    const productSku = await this.findOneById(id);
    const image = productSku?.images?.filter((image) => image.id == imageId);

    if (!productSku || image?.length <= 0) {
      throw new NotFoundException();
    }

    await Promise.all([
      this.fileService.delete(imageId),
      this.productRepo.update(
        { id },
        { images: [...productSku.images.filter((item) => item.id != imageId)] },
      ),
    ]);

    return {
      message: 'Image deleted successfully',
    };
  }

  async uploadImages(files: Express.Multer.File[], limit: number = 4) {
    const images: Promise<File>[] = [];

    for (let i = 0; i < files.length && limit != 0; i++) {
      images.push(this.fileService.create(files[i]));
      limit -= 1;
    }

    const result = await Promise.all(images);

    return result.map((item) => ({ id: item.id, url: item.url }));
  }

  async deletedImages(files: Partial<File>[]) {
    const promisefiles = files.map((item) => this.fileService.delete(item.id));
    return await Promise.all(promisefiles);
  }
}
