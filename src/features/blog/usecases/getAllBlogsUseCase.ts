import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../repositories/blogs-query.repository';
import { SortBlogsDto } from '../dto/sort-blog.input.dto';
import { BlogOutputModelMapper } from '../dto/blog-output.model';

export class GetAllBlogsUseCaseCommand {
  constructor(public sortData: SortBlogsDto) {}
}

@CommandHandler(GetAllBlogsUseCaseCommand)
export class GetAllBlogsUseCase
  implements ICommandHandler<GetAllBlogsUseCaseCommand>
{
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(command: GetAllBlogsUseCaseCommand) {
    const sortBy: string = command.sortData.sortBy ?? 'created_at';
    const sortDirection: 'asc' | 'desc' =
      command.sortData.sortDirection ?? 'desc';
    const pageNumber: number = command.sortData.pageNumber ?? 1;
    const pageSize: number = command.sortData.pageSize ?? 10;
    const searchNameTerm: string | null =
      command.sortData.searchNameTerm ?? null;

    let filter: any = {};

    if (searchNameTerm) {
      filter.name = searchNameTerm;
    }

    const blogs = await this.blogsQueryRepository.findAllBlogsByFilter(
      filter,
      sortBy,
      sortDirection,
      (pageNumber - 1) * pageSize,
      pageSize,
    );

    const totalCount: number =
      await this.blogsQueryRepository.countDocuments(filter);
    const pageCount: number = Math.ceil(totalCount / pageSize);
    console.log('blogs usecase', blogs);
    return {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: blogs.map(BlogOutputModelMapper),
    };
  }
}
