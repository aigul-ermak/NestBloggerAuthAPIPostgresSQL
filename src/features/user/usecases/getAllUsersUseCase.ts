import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortUserDto } from '../dto/sort-user.dto';
import { UsersQueryRepository } from '../repositories/users-query.repository';
import { UserOutputModelMapper } from '../dto/model/user-output.model';

export class GetAllUsersUseCaseCommand {
  constructor(public sortData: SortUserDto) {}
}

@CommandHandler(GetAllUsersUseCaseCommand)
export class GetAllUsersUseCase
  implements ICommandHandler<GetAllUsersUseCaseCommand>
{
  constructor(private usersQueryRepository: UsersQueryRepository) {}

  //TODO type then delete
  async execute(command: GetAllUsersUseCaseCommand): Promise<any> {
    const sortBy = command.sortData.sortBy ?? 'createdAt';
    const sortDirection = command.sortData.sortDirection ?? 'desc';
    const pageNumber = command.sortData.pageNumber ?? 1;
    const pageSize = command.sortData.pageSize ?? 10;
    const searchLoginTerm = command.sortData.searchLoginTerm ?? null;
    const searchEmailTerm = command.sortData.searchEmailTerm ?? null;

    let filter: any = {};
    if (searchLoginTerm) filter.login = searchLoginTerm;
    if (searchEmailTerm) filter.email = searchEmailTerm;

    const skip = (pageNumber - 1) * pageSize;

    const users = await this.usersQueryRepository.findAll(
      filter,
      sortBy,
      sortDirection,
      skip,
      pageSize,
    );

    const totalCount = await this.usersQueryRepository.countDocuments(filter);
    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: users.map(UserOutputModelMapper),
    };
  }
}
