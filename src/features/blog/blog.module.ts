import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { CreateBlogUseCase } from './usecases/createBlogUseCase';
import { CqrsModule } from '@nestjs/cqrs';
import { DatabaseModule } from '../../database.module';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsQueryRepository } from './repositories/blogs-query.repository';

const CommandHandlers = [CreateBlogUseCase];

@Module({
  imports: [CqrsModule, DatabaseModule],
  controllers: [BlogController],
  providers: [...CommandHandlers, BlogsRepository, BlogsQueryRepository],
  exports: [BlogsRepository, BlogsQueryRepository],
})
export class BlogModule {}
