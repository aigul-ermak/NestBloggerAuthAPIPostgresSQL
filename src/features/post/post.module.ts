import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../../database.module';
import { PostsRepository } from './repositiories/posts.repository';
import { PostsQueryRepository } from './repositiories/posts-query.repository';
import { CreatePostUseCase } from './usecases/createPostUseCase';
import { BlogsQueryRepository } from '../blog/repositories/blogs-query.repository';
import { PostService } from './post.service';
import { GetPostByIdUseCase } from './usecases/getPostByIdUseCase';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { updatePostForBlogUseCase } from './usecases/updatePostForBlogUseCase';

const CommandHandlers = [
  CreatePostUseCase,
  GetPostByIdUseCase,
  updatePostForBlogUseCase,
];

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwtSettings.JWT_ACCESS_SECRET'),

          signOptions: {
            expiresIn: configService.get<string>(
              'jwtSettings.ACCESS_TOKEN_EXPIRY',
            ),
          },
        };
      },
    }),
  ],
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
