import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Carts } from './carts.entity';
import { Product } from 'src/module/product/entities/product.entity';
import { ProductOption } from 'src/module/product-option/entities/product-option.entity';

@Entity('cart_itemss')
export class CartItems extends AbstractEntity {
  @ManyToOne(() => Carts, (cart) => cart.cartItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'Cart_id' })
  cart: Carts;

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductOption, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'product_option', })
  productOption: ProductOption;

  @Column({ default: 1 })
  quantity: number;

  amount: number;

  @AfterLoad()
  afterLoad() {
    if (this.product) this.amount = (this.product.price * (1 - this.product.discount) + (this.productOption?.priceIncrement || 0)) * this.quantity
  }
}
