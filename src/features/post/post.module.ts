import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../../database.module';
import { PostsRepository } from './repositiories/posts.repository';
import { PostsQueryRepository } from './repositiories/posts-query.repository';
import { CreatePostUseCase } from './usecases/createPostUseCase';
import { BlogsQueryRepository } from '../blog/repositories/blogs-query.repository';
import { PostService } from './post.service';

const CommandHandlers = [CreatePostUseCase];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [PostController],
  providers: [
    ...CommandHandlers,
    PostService,
    PostsRepository,
    PostsQueryRepository,
    BlogsQueryRepository,
  ],
  exports: [PostsRepository, PostsQueryRepository],
})
export class PostModule {}
