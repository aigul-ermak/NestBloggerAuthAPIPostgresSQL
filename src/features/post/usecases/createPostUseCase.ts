import { CreatePostDto } from '../dto/create-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../../blog/repositories/blogs-query.repository';
import { PostsRepository } from '../repositiories/posts.repository';
import { PostsQueryRepository } from '../repositiories/posts-query.repository';
import { NotFoundException } from '@nestjs/common';
import { PostInputType } from '../dto/types/postInputType';
import { mapPostToResponse } from '../dto/model/postDBOutputModel';

export class CreatePostUseCaseCommand {
  constructor(public post: CreatePostDto) {}
}

@CommandHandler(CreatePostUseCaseCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostUseCaseCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    // private likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute(command: CreatePostUseCaseCommand) {
    const blog = await this.blogsQueryRepository.getBlogById(
      command.post.blogId,
    );

    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    const newCreatePost: PostInputType = {
      ...command.post,
      createdAt: new Date(Date.now()),
    };

    const createdPostId = await this.postsRepository.createPost(newCreatePost);

    const post = await this.postsQueryRepository.getPostById(createdPostId);

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    return mapPostToResponse(post, blog.name);
  }
}
