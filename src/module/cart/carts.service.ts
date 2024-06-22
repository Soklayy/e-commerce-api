import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Carts } from './entities/carts.entity';
import { CartItems } from './entities/cart-items.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Carts)
    private readonly cartRepo: Repository<Carts>,
    @InjectRepository(CartItems)
    private readonly cartItemRepo: Repository<CartItems>,
  ) { }
  async create(createCartDto: CreateCartDto, userId: string) {
    let cart: Carts;
    let cartItem: CartItems;
    const [product, option] = await Promise.all([
      await this.productRepo.findOneBy({ id: createCartDto.productId }),
      createCartDto?.optionId ? await this.productRepo.findOneBy({ option: { id: createCartDto.optionId } }) : undefined
    ])

    if (!product) throw new NotFoundException('Product not found.');
    if (!option && createCartDto.optionId) throw new NotFoundException('Option not found.');

    cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      select: {
        id: true,
      },
    });

    //create cart
    if (!cart) {
      cart = await this.cartRepo.save(this.cartRepo.create({
        user: {
          id: userId
        }
      }));
    }

    //cart items
    cartItem = await this.cartItemRepo.findOne({
      where: {
        cart: { id: cart.id },
        product: {
          id: createCartDto.productId,
          option: createCartDto.optionId ? { id: createCartDto?.optionId } : undefined
        }
      }
    })

    cartItem = cartItem
      ? await this.cartItemRepo.save({ id: cartItem.id, quantity: createCartDto.quantity })
      : await this.cartItemRepo.save(this.cartItemRepo.create({
        cart: { id: cart.id },
        product: { id: createCartDto.productId },
        productOption: createCartDto.optionId ? { id: createCartDto?.optionId } : null,
        quantity: createCartDto.quantity
      }));

    return {
      message: 'Successfuly',
      item: cartItem
    };
  }

  async findAll(userId: string) {
    let cart = await this.cartRepo.findOne({
      where: {
        user: { id: userId },
      },
      select: {
        cartItem: {
          id: true,
          quantity: true,
          productOption: {
            id: true,
            name: true,
            priceIncrement: true
          },
          product: {
            id: true,
            price: true,
            discount: true,
          }
        },
      },
      relations: {
        cartItem: {
          productOption: true,
        },
      },
    });

    //check if hasn't cart create one
    if (!cart) {
      cart = await this.cartRepo.save(
        this.cartRepo.create({
          user: {
            id: userId,
          },
        }),
      );
      delete cart.user;
      cart.cartItem = [];
      return cart;
    }

    // calculate total
    let total = 0;
    cart.cartItem?.map((item) => {
      total += item.amount;
    });
    if (Number(total.toFixed(2)) !== cart.total) {
      cart.total = Number(total.toFixed(2));
      this.cartRepo.update({ id: cart.id }, { total });
    }

    return cart;
  }


  async update(
    cartItemid: string,
    updateCartDto: UpdateCartDto,
    userId: string,
  ) {
    const cartItem = await this.cartItemRepo.findOne({
      where: {
        id: cartItemid,
        cart: { user: { id: userId } },
      },
      select: {
        product: {
          price: true,
          discount: true,
        },
        productOption: {
          name: true,
          priceIncrement: true
        }
      },
      relations: {
        product: true,
        productOption: true
      },
    });

    if (!cartItem) {
      throw new BadRequestException('Item not exist');
    }
    if (updateCartDto.quantity <= 0) {
      await this.cartItemRepo.remove(cartItem);
      return {
        message: 'Remove item from cart.',
      };
    }

    cartItem.quantity = updateCartDto.quantity;
    cartItem.afterLoad();
    return cartItem;
  }

}
