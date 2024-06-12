import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(file: Express.Multer.File) {
    let fileItem: Partial<File> | null = null;
    try {
      fileItem = await this.firebaseService.uploadFile(file);
      return this.fileRepository.save(this.fileRepository.create(fileItem));
    } catch (error) {
      // delete file in firebase if have any errors
      if (fileItem) {
        await this.firebaseService.deleteFile(fileItem.path);
      }

      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    return this.fileRepository.findOneBy({ id });
  }

  async update(id: string, file: Express.Multer.File) {
    const files = await this.findOne(id);
    if (!files) throw new NotFoundException('File not found');
    await this.firebaseService.updateFile(file, files.path);
    return files;
  }

  async delete(id: string) {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) throw new NotFoundException('File not found');
    await this.firebaseService.deleteFile(file.path);
    await this.fileRepository.remove(file);
    return true;
  }
}
