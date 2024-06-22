import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { File } from '../file/entities/file.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    private fileService: FileService,
  ) {}

  async create(createBrandDto: CreateBrandDto, file?: Express.Multer.File) {
    let logo: File | null = null;
    try {
      if (file) {
        logo = await this.fileService.create(file);
      }
      const brand = this.brandRepo.create({ ...createBrandDto, logo });
      return await this.brandRepo.save(brand);
    } catch (error) {
      if (logo) {
        await this.fileService.delete(logo.id);
      }
      throw error;
    }
  }

  async findAll() {
    const brand = await this.brandRepo.find({
      relations: { logo: true },
      select: {
        logo: {
          url: true,
        },
      },
    });
    return brand;;
  }

  async findOne(id: string) {
    return await this.brandRepo.findOneBy({ id });
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
    file?: Express.Multer.File,
  ) {
    let logo: File | null = null;
    try {
      const brand = await this.brandRepo.findOne({
        where: {
          id,
        },
        relations: {
          logo: true,
        },
      });

      if (!brand) {
        throw new NotFoundException('Brand not found');
      }

      if (file) {
        brand?.logo
          ? await this.fileService.update(brand.logo.id, file)
          : (logo = brand.logo = await this.fileService.create(file));
      }
      Object.assign(brand, updateBrandDto);
      return await this.brandRepo.save(brand);
    } catch (error) {
      if (logo) {
        await this.fileService.delete(logo.id);
      }
      throw error;
    }
  }

  async remove(id: string) {
    const brand = await this.brandRepo.findOne({
      where: {
        id,
      },
      relations: {
        logo: true,
      },
      select: {
        logo: {
          id: true,
        },
      },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await Promise.all([
      this.brandRepo.remove(brand),
      brand?.logo && this.fileService.delete(brand?.logo?.id),
    ]);

    return {
      message: 'Success',
    };
  }
}
