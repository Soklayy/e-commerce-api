import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @Post()
  create(@Req() req: Request, @Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto, req?.user?.id);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.cartsService.findAll(req?.user?.id);
  }

  @Patch(':cart-item-id')
  update(
    @Param('cart-item-id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: Request
  ) {
    return this.cartsService.update(id, updateCartDto, req?.user?.id);
  }
}
