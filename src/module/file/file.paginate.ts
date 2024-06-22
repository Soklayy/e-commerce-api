import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { File } from './entities/file.entity';

export const FILE_PAGINATION_CONFIG: PaginateConfig<File> = {
  sortableColumns: ['createdAt'],
  defaultSortBy: [['createdAt', 'DESC']],
  filterableColumns: {
    url: [FilterOperator.EQ],
  },
};
