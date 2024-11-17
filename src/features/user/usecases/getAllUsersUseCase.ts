import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortUserDto } from '../dto/sort-user.dto';
import { UsersQueryRepository } from '../repositories/users-query.repository';
import { UserOutputModelMapper } from '../dto/model/user-output.model';
import { PaginatedUsersType } from '../dto/type/paginatedUsersType';
import { User } from '../entities/user.entity';

export class GetAllUsersUseCaseCommand {
  constructor(public sortData: SortUserDto) {}
}

@CommandHandler(GetAllUsersUseCaseCommand)
export class GetAllUsersUseCase
  implements ICommandHandler<GetAllUsersUseCaseCommand>
{
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  async execute(
    command: GetAllUsersUseCaseCommand,
  ): Promise<PaginatedUsersType> {
    const sortBy: string = command.sortData.sortBy ?? 'created_at';
    const sortDirection: 'asc' | 'desc' =
      command.sortData.sortDirection ?? 'desc';
    const pageNumber: number = command.sortData.pageNumber ?? 1;
    const pageSize: number = command.sortData.pageSize ?? 10;
    const searchLoginTerm: string = command.sortData.searchLoginTerm ?? null;
    const searchEmailTerm: string = command.sortData.searchEmailTerm ?? null;

    let filter: any = {};
    if (searchLoginTerm) filter.login = searchLoginTerm;
    if (searchEmailTerm) filter.email = searchEmailTerm;

    const skip: number = (pageNumber - 1) * pageSize;

    const users: User[] = await this.usersQueryRepository.findAll(
      filter,
      sortBy,
      sortDirection,
      skip,
      pageSize,
    );

    const totalCount: number =
      await this.usersQueryRepository.countDocuments(filter);

    const pageCount: number = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: users.map(UserOutputModelMapper),
    };
  }
}
