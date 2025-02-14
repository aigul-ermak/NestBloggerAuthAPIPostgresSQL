import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SortPostsDto } from '../../post/dto/sort-post.input.dto';
import { PostsQueryRepository } from '../../post/repositiories/posts-query.repository';
import { BlogsQueryRepository } from '../repositories/blogs-query.repository';
import { NotFoundException } from '@nestjs/common';
import { PostLikeOutputModelMapper } from '../../post/dto/post-db-output.dto';
import { LIKE_STATUS } from '../../../base/enums/enums';

export class GetAllPostsForBlogUseCaseCommand {
  constructor(
    public blogId: number,
    public sortData: SortPostsDto,
    public userId: string | null,
  ) {}
}

@CommandHandler(GetAllPostsForBlogUseCaseCommand)
export class GetAllPostsForBlogUseCase
  implements ICommandHandler<GetAllPostsForBlogUseCaseCommand>
{
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    // private likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute(command: GetAllPostsForBlogUseCaseCommand) {
    const sortBy: string = command.sortData.sortBy ?? 'created_at';
    const sortDirection: 'asc' | 'desc' =
      command.sortData.sortDirection ?? 'desc';
    const page: number = command.sortData.pageNumber ?? 1;
    const size: number = command.sortData.pageSize ?? 10;

    const blog = await this.blogsQueryRepository.getBlogById(command.blogId);

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    const totalCount: number = await this.postsQueryRepository.countByBlogId(
      command.blogId,
    );

    const pagesCount: number = Math.ceil(totalCount / +size);

    const skip = (page - 1) * size;

    const posts = await this.postsQueryRepository.findPostsByBlogIdPaginated(
      command.blogId,
      sortBy,
      sortDirection,
      page,
      size,
    );

    const mappedPosts = await Promise.all(
      posts.map(async (post) => {
        let status: LIKE_STATUS = LIKE_STATUS.NONE;
        const newestLikes = [];
        return PostLikeOutputModelMapper(post, newestLikes, status);
      }),
    );

    return {
      pagesCount: pagesCount,
      page: +page,
      pageSize: +size,
      totalCount: +totalCount,
      items: mappedPosts,
    };
  }
}
