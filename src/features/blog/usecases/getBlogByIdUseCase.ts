import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../repositories/blogs.repository';
import { BlogsQueryRepository } from '../repositories/blogs-query.repository';
import { NotFoundException } from '@nestjs/common';

export class GetBlogByIdUseCaseCommand {
  constructor(public id: number) {}
}

@CommandHandler(GetBlogByIdUseCaseCommand)
export class GetBlogByIdUseCase
  implements ICommandHandler<GetBlogByIdUseCaseCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(command: GetBlogByIdUseCaseCommand) {
    const blog = await this.blogsQueryRepository.getBlogById(command.id);

    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    return {};
  }
}
