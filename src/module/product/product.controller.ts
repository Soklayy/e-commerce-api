import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/commons/decorators/public.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  CreateProductSchema,
  UpdateProductSchema,
} from 'src/commons/schema/product.schema';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/commons/enums/role.enum';
import { Paginate, PaginateQuery, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { Product } from './entities/product.entity';
import { PRODUCT_PAGINATION_CONFIG } from './dto/pagination.config';

@ApiTags('Products')
@Controller('product')
@Public()
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Public()
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    type: CreateProductSchema,
  })
  @UseInterceptors(FilesInterceptor('images'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    return this.productService.create(createProductDto, file);
  }

  @Get()
  @Public()
  @PaginatedSwaggerDocs(Product, PRODUCT_PAGINATION_CONFIG)
  findAll(@Paginate() query: PaginateQuery) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiConsumes('multipart/form-data', 'application/json')
  @ApiBody({
    type: UpdateProductSchema,
  })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }


  // image route

  @ApiConsumes('multipart/form-data', 'application/json')
  @Post(':id/image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      "type": "object",
      "properties": {
        "images": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "binary"
          }
        }
      }
    }
  })
  addImages(
    @Param('id') id: string,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    return this.productService.addImage(id, file);
  }

  @Patch(':id/image/:imageId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  updateImage(
    @Param('id') id: string,
    @Param('imageId') iamgeId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.updateImage(id, iamgeId, file);
  }

  @Delete(':id/image/:imageId')
  removeImage(
    @Param('id') id: string,
    @Param('imageId') iamgeId: string,
  ) {
    return this.productService.removeImage(id, iamgeId);
  }
}
