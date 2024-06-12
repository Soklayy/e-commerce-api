import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductAttributeDto } from './dto/create-product-atrribute.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/commons/decorators/public.decorator';
import { ProductAttributesService } from './product-attributes.service';
import { UpdateProductAtrributeDto } from './dto/update-product-atrribute.dto';

@Public()
@ApiTags('Product Attributes')
@Controller('product-attributes')
export class ProductAttributesController {
  constructor(
    private readonly productAttributeService: ProductAttributesService,
  ) {}

  @Post()
  create(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributeService.create(createProductAttributeDto);
  }

  @Get()
  findAll() {
    return this.productAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productAttributeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductAttributeDto: UpdateProductAtrributeDto,
  ) {
    return this.productAttributeService.update(id, updateProductAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productAttributeService.remove(id);
  }
}
