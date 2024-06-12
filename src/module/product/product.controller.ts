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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/commons/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CreateProductSchema,
  UpdateProductSchema,
} from 'src/commons/schema/product.schema';
import { Roles } from 'src/commons/decorators/roles.decorator';
import { Role } from 'src/commons/enums/role.enum';
import { ApiOkPaginatedResponse, Paginate, PaginateQuery, PaginatedSwaggerDocs } from 'nestjs-paginate';
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
  @UseInterceptors(FileInterceptor('cover'))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
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
  @UseInterceptors(FileInterceptor('cover'))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.update(id, updateProductDto, file);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
