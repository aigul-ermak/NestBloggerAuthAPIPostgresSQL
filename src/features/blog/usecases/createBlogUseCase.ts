import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../repositories/blogs.repository';
import { CreateBlogDto } from '../dto/create-blog.dto';

export class CreateBlogUseCaseCommand {
  constructor(public createBlogDto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogUseCaseCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogUseCaseCommand>
{
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogUseCaseCommand): Promise<Number> {
    const { name, description, websiteUrl } = command.createBlogDto;

    const createdBlogId: Number = await this.blogsRepository.createBlog(
      name,
      description,
      websiteUrl,
    );

    return createdBlogId;
  }
}