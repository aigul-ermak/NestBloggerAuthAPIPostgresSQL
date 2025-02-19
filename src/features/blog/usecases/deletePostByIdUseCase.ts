import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../repositories/blogs.repository';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { BlogsQueryRepository } from '../repositories/blogs-query.repository';
import { PostsRepository } from '../../post/repositiories/posts.repository';
import { NotFoundException } from '@nestjs/common';
import { PostsQueryRepository } from '../../post/repositiories/posts-query.repository';

export class DeletePostForBlogUseCaseCommand {
  constructor(
    public blogId: number,
    public postId: number,
  ) {}
}

@CommandHandler(DeletePostForBlogUseCaseCommand)
export class DeletePostForBlogUseCase
  implements ICommandHandler<DeletePostForBlogUseCaseCommand>
{
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: DeletePostForBlogUseCaseCommand) {
    const blog = await this.blogsQueryRepository.getBlogById(command.blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const post = await this.postsQueryRepository.getPostById(command.postId);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.postsRepository.deletePost(command.postId);
  }
}
