import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@ApiTags('Carts')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add new item to cart' })
  addToCart(@Body() createCartDto: CreateCartDto, @Req() req: Request) {
    const userId = req?.user?.id;
    return this.cartService.create(createCartDto, userId);
  }

  @Get()
  find(@Req() req: Request) {
    const userId = req?.user?.id;
    return this.cartService.find(userId);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update quantity of item in cart' })
  updateItemCart(
    @Param('cartItemId') cartItemId: string,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req: Request,
  ) {
    const userId = req?.user?.id;
    return this.cartService.updateItemCart(cartItemId, updateCartDto, userId);
  }
}
