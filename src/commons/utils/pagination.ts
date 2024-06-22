import { PaginateConfig, PaginateQuery } from 'nestjs-paginate';

export const selectPagination = (
  query: PaginateQuery,
  config: PaginateConfig<any>,
) => {
  if (query.select) {
    query?.sortBy?.length
      ? query.sortBy?.map((sort) => {
          if (!query.select.includes(sort[0])) {
            query.select.push(sort[0]);
          }
        })
      : config.defaultSortBy.map((sort) => {
          if (!query?.select.includes(sort[0])) {
            query.select.push(sort[0]);
          }
        });
  }
};
