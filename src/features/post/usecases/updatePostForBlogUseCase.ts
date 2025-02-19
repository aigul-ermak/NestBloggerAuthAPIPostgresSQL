import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../blog/repositories/blogs-query.repository';
import { PostsRepository } from '../repositiories/posts.repository';
import { PostsQueryRepository } from '../repositiories/posts-query.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdatePostForBlogType } from '../dto/types/updatePostForBlogType';

export class UpdatePostForBlogUseCaseCommand {
  constructor(public updatePostForBlogType: UpdatePostForBlogType) {}
}

@CommandHandler(UpdatePostForBlogUseCaseCommand)
export class updatePostForBlogUseCase
  implements ICommandHandler<UpdatePostForBlogUseCaseCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    // private likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute(command: UpdatePostForBlogUseCaseCommand) {
    const blog = await this.blogsQueryRepository.getBlogById(
      command.updatePostForBlogType.blogId,
    );

    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    const post = await this.postsQueryRepository.getPostById(
      command.updatePostForBlogType.postId,
    );

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    const updatePost = {
      postId: command.updatePostForBlogType.postId,
      title: command.updatePostForBlogType.title,
      shortDescription: command.updatePostForBlogType.shortDescription,
      content: command.updatePostForBlogType.content,
    };

    const isUpdatedPost = await this.postsRepository.updatePost(updatePost);

    if (!isUpdatedPost) {
      throw new NotFoundException(`Post is not updated`);
    }

    return isUpdatedPost;
  }
}
