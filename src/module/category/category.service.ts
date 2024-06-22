import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { File } from '../file/entities/file.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly fileService: FileService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    file?: Express.Multer.File,
  ) {
    let cover: File | null = null;
    try {
      if (file) {
        cover = await this.fileService.create(file);
      }
      const category = await this.categoryRepo.save(
        this.categoryRepo.create({ ...createCategoryDto, cover }),
      );
      return {
        ...category,
        cover: category.cover?.url || null,
      };
    } catch (error) {
      if (cover) {
        this.fileService.delete(cover.id);
      }
      throw error;
    }
  }

  async findAll() {
    const category = await this.categoryRepo.find({
      select: { cover: { url: true } },
      relations: { cover: true },
    });
    return category;
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: {
        cover: true,
      },
      select: {
        cover: { url: true },
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    file: Express.Multer.File,
  ) {
    let cover: File | null = null;
    try {
      const category = await this.categoryRepo.findOne({
        where: { id },
        relations: {
          cover: true,
        },
      });

      if (!category) throw new NotFoundException('Category not found');

      if (file) {
        if (category?.cover) {
          await this.fileService.update(category.cover.id, file);
        } else {
          cover = await this.fileService.create(file);
          category.cover = cover;
        }
      }

      Object.assign(category, updateCategoryDto);
      return await this.categoryRepo.save(category);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { id },
        relations: {
          cover: true,
        },
        select: { id: true },
      });

      if (!category) throw new NotFoundException('Category not found');

      await Promise.all([
        this.categoryRepo.remove(category),
        category?.cover && this.fileService.delete(category?.cover?.id),
      ]);

      return {
        message: 'success',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
