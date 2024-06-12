import { FilterOperator, FilterSuffix, PaginateConfig } from "nestjs-paginate";
import { Product } from "../entities/product.entity";

export const PRODUCT_PAGINATION_CONFIG: PaginateConfig<Product> = {
    sortableColumns: ['name', 'category.name'],
    defaultSortBy: [['name', 'ASC']],
    searchableColumns: ['name', 'category.name'],
    select: [
        'id',
        'name',
        'summary',
        'price',
        'createdAt',
        'updatedAt',
        'cover.url',
        'category.id',
        'category.name',
        'category.description',
        'productSku.id',
        'productSku.sku',
        'productSku.price',
        'productSku.discount',
        'productSku.image.url',
        'productSku.size.value',
        'productSku.color.value'
    ],
    relations: {
        category: true,
        cover: true,
        productSku: {
            image: true,
            color: true,
            size: true
        }
    },
    filterableColumns: {
        name: [FilterOperator.ILIKE, FilterSuffix.NOT]
    },
}