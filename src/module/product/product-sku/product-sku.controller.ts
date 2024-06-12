import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductSkuService } from './product-sku.service';
import { CreateProductSkuDto } from './dto/create-product-sku.dto';
import { UpdateProductSkuDto } from './dto/update-product-sku.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/commons/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Product Skus')
@Public()
@Controller('product-sku')
export class ProductSkuController {
  constructor(private readonly productSkuService: ProductSkuService) {}

  @Post()
  @ApiConsumes('multipart/form-data', 'application/json')
  create(@Body() createDto: CreateProductSkuDto) {
    return this.productSkuService.create(createDto);
  }

  @Get()
  findAll() {
    return this.productSkuService.findAll();
  }

  @Get(':sku')
  findOne(@Param('sku') sku: string) {
    return this.productSkuService.findOne(sku);
  }

  @Patch(':sku')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data', 'application/json')
  update(
    @Param('sku') sku: string,
    @Body() updateDto: UpdateProductSkuDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productSkuService.update(sku, updateDto);
  }

  @Delete(':sku')
  remove(@Param('sku') sku: string) {
    return this.productSkuService.remove(sku);
  }
}
