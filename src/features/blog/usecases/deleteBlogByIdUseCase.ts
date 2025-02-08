import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../repositories/blogs.repository';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../repositories/blogs-query.repository';

export class DeleteBlogByIdUseCaseCommand {
  constructor(public id: number) {}
}

@CommandHandler(DeleteBlogByIdUseCaseCommand)
export class DeleteBlogByIdUseCase
  implements ICommandHandler<DeleteBlogByIdUseCaseCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(command: DeleteBlogByIdUseCaseCommand): Promise<boolean> {
    const blog = await this.blogsQueryRepository.getBlogById(command.id);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const isDeleted = await this.blogsRepository.deleteById(command.id);

    if (!isDeleted) {
      throw new InternalServerErrorException('Failed to delete blog');
    }

    return true;
  }
}
