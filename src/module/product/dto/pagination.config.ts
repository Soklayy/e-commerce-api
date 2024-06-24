import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { Product } from '../entities/product.entity';

export const PRODUCT_PAGINATION_CONFIG: PaginateConfig<Product> = {
  sortableColumns: ['name', 'category.name','createdAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  searchableColumns: ['name', 'category.name', 'brand.name'],
  select: [
    'id',
    'name',
    'description',
    'price',
    'images',
    'discount',
    'quantity',
    'createdAt',
    'updatedAt',
    'category.id',
    'category.name',
    'category.description',
    'brand.name',
    'brand.logo.url',
  ],
  relations: {
    category: true,
    brand: {
      logo: true,
    }
  },
  filterableColumns: {
    'category.name': [FilterOperator.EQ],
    'brand.name': [FilterOperator.EQ],
  },
};
