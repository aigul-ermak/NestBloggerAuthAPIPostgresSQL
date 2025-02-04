import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../repositories/blogs.repository';
import { BlogsQueryRepository } from '../repositories/blogs-query.repository';
import { NotFoundException } from '@nestjs/common';
import { BlogOutputModel } from '../dto/blog-output.model';

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

  async execute(command: GetBlogByIdUseCaseCommand): Promise<BlogOutputModel> {
    //TODO type
    const blog = await this.blogsQueryRepository.getBlogById(command.id);

    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    return {
      id: blog.id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.website_url,
      createdAt: blog.created_at,
      isMembership: false,
    };
  }
}
