import { UserOutputModel } from '../model/user-output.model';

export type PaginatedUsersType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<UserOutputModel>;
};
