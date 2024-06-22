import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductOptionService } from './product-option.service';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductOptionDto } from './dto/update-product-option.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/commons/decorators/public.decorator';

@Public()
@ApiTags('Product options')
@Controller('product-option')
export class ProductOptionController {
  constructor(private readonly productOptionService: ProductOptionService) {}

  @Post()
  create(@Body() createProductOptionDto: CreateProductOptionDto) {
    return this.productOptionService.create(createProductOptionDto);
  }

  @Get()
  findAll() {
    return this.productOptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productOptionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductOptionDto: UpdateProductOptionDto,
  ) {
    return this.productOptionService.update(+id, updateProductOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productOptionService.remove(+id);
  }
}
