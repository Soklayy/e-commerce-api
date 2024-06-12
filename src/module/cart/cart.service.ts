import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductSku } from '../product/entities/product-sku.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(ProductSku)
    private readonly productSkuRepo: Repository<ProductSku>,
  ) { }

  async create(createCartDto: CreateCartDto, userId: string) {
    let cartItem: CartItem;
    let cart: Cart;
    const productSku = await this.productSkuRepo.findOne({
      where: {
        id: createCartDto.productSku,
      },
      select: {
        id: true,
        price: true,
        discount: true
      }
    });

    if (!productSku) {
      throw new BadRequestException('This productSku not exist');
    }

    cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      select: {
        id: true
      }
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
      cartItem = this.cartItemRepo.create({
        ...createCartDto,
        productSku,
        cart,
      });
    } else {
      cartItem = await this.cartItemRepo.findOneBy({
        cart: {
          id: cart.id,
        },
        productSku: {
          id: productSku.id,
        },
      });

      //check if has item just update quantity
      if (cartItem) {
        cartItem.quantity = createCartDto.quantity || 1;
      } else {
        cartItem = this.cartItemRepo.create({
          ...createCartDto,
          productSku,
          cart,
        });
      }
    }

    cartItem = await this.cartItemRepo.save(cartItem);
    delete cartItem?.cart;
    // delete cartItem?.productSku;
    return cartItem;
  }

  async find(userId: string) {
    let cart = await this.cartRepo.findOne({
      where: {
        user: { id: userId },
      },
      select: {
        cartItem: {
          id: true,
          quantity: true,
          productSku: {
            id: true,
            price: true,
            discount: true
          }
        }
      },
      relations: {
        cartItem: {
          productSku: true,
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

    let total = 0;
    cart.cartItem?.map(item => {
      const sku = item.productSku
      total += item.quantity * (sku.price * (1 - sku.discount))
    })

    if (total !== cart.total) {
      cart.total = total;
      this.cartRepo.update({ id: cart.id }, { total });
    }

    return cart;
  }

  async updateItemCart(
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
        productSku: {
          price: true,
          discount: true,
        },
      },
      relations: {
        productSku: true,
      }
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

    return this.cartItemRepo.save(cartItem);
  }
}
