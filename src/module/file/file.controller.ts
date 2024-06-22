import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { Public } from 'src/commons/decorators/public.decorator';
import { Paginate, PaginateQuery, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { File } from './entities/file.entity';
import { FILE_PAGINATION_CONFIG } from './file.paginate';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/commons/enums';

@Public()
@Roles(Role.ADMIN)
@ApiTags('Files')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  create(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.create(file);
  }

  @Get()
  @PaginatedSwaggerDocs(File, FILE_PAGINATION_CONFIG)
  findAll(@Paginate() query: PaginateQuery) {
    return this.fileService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<File> {
    return this.fileService.update(id, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.delete(id);
  }
}
