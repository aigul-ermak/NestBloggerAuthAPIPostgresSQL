import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../repositories/blogs.repository';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogsQueryRepository } from '../repositories/blogs-query.repository';
import { NotFoundException } from '@nestjs/common';

export class UpdateBlogUseCaseCommand {
  constructor(
    public blogId: number,
    public updateBlogDto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogUseCaseCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdateBlogUseCaseCommand>
{
  constructor(
    private blogsRepository: BlogsRepository,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(command: UpdateBlogUseCaseCommand): Promise<Number> {
    const blog = await this.blogsQueryRepository.getBlogById(command.blogId);

    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    const { blogId, updateBlogDto } = command;

    const isUpdated = await this.blogsRepository.update(blogId, updateBlogDto);

    if (!isUpdated) {
      throw new NotFoundException(
        `Update failed, blog not found or no changes made`,
      );
    }

    return 1;
  }
}
