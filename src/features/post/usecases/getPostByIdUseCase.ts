import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsQueryRepository } from '../repositiories/posts-query.repository';
import { NotFoundException } from '@nestjs/common';
import { LIKE_STATUS } from '../../../base/enums/enums';
import { PostLikeOutputModelMapper } from '../dto/post-db-output.dto';

export class GetPostByIdUseCaseCommand {
  constructor(
    public id: number,
    public userId: string | null,
  ) {}
}

@CommandHandler(GetPostByIdUseCaseCommand)
export class GetPostByIdUseCase
  implements ICommandHandler<GetPostByIdUseCaseCommand>
{
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    //private likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute(command: GetPostByIdUseCaseCommand) {
    const post = await this.postsQueryRepository.getPostById(command.id);

    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    const newestLikes = [];
    let status = LIKE_STATUS.NONE;

    // if (command.userId) {
    //   const likeToPost: LikeDocument | null =
    //     await this.likesQueryRepository.getLike(command.id, command.userId);

    // status = likeToPost ? likeToPost.status : 'None';

    // }

    return PostLikeOutputModelMapper(post, newestLikes, status);
  }
}
