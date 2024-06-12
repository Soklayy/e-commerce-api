import { AbstractEntity } from 'src/commons/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from 'src/module/product/entities/product.entity';
import { ProductSku } from 'src/module/product/entities/product-sku.entity';

@Entity('cart_items')
export class CartItem extends AbstractEntity {
  @ManyToOne(() => Cart, (Cart) => Cart.cartItem, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'Cart_id' })
  cart: Cart;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductSku, (sku) => sku.cartItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sku_id' })
  productSku: ProductSku;

  @Column()
  quantity: number;
}
