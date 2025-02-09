import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { CreateBlogUseCase } from './usecases/createBlogUseCase';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../../database.module';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsQueryRepository } from './repositories/blogs-query.repository';
import { GetBlogByIdUseCase } from './usecases/getBlogByIdUseCase';
import { UpdateBlogUseCase } from './usecases/updateBlogUseCase';
import { DeleteBlogByIdUseCase } from './usecases/deleteBlogByIdUseCase';
import { GetAllBlogsUseCase } from './usecases/getAllBlogsUseCase';
import { BlogSuperAdminController } from './blog-super-admin.controller';
import { CreatePostUseCase } from '../post/usecases/createPostUseCase';
import { PostsRepository } from '../post/repositiories/posts.repository';
import { PostsQueryRepository } from '../post/repositiories/posts-query.repository';

const CommandHandlers = [
  CreateBlogUseCase,
  GetBlogByIdUseCase,
  UpdateBlogUseCase,
  DeleteBlogByIdUseCase,
  GetAllBlogsUseCase,
  CreatePostUseCase,
];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [BlogController, BlogSuperAdminController],
  providers: [
    ...CommandHandlers,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsQueryRepository,
  ],
  exports: [BlogsRepository, BlogsQueryRepository],
})
export class BlogModule {}
