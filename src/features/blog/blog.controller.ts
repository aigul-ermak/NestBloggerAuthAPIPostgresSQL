import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetBlogByIdUseCaseCommand } from './usecases/getBlogByIdUseCase';
import { SortBlogsDto } from './dto/sort-blog.input.dto';
import { GetAllBlogsUseCaseCommand } from './usecases/getAllBlogsUseCase';
import { JwtAuthNullableGuard } from '../../base/guards/auth-guards/jwt-auth-nullable.guard';
import { SortPostsDto } from '../post/dto/sort-post.input.dto';
import { GetAllPostsForBlogUseCaseCommand } from './usecases/getAllPostsForBlogUseCase';

@Controller('blogs')
export class BlogController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  async findAll(@Query() sortData: SortBlogsDto) {
    return this.commandBus.execute(new GetAllBlogsUseCaseCommand(sortData));
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.commandBus.execute(new GetBlogByIdUseCaseCommand(id));
  }

  @Get(':id/posts')
  @UseGuards(JwtAuthNullableGuard)
  async getPostsForBlog(
    @Param('id') blogId: number,
    @Query() sortData: SortPostsDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];

    return await this.commandBus.execute(
      new GetAllPostsForBlogUseCaseCommand(blogId, sortData, userId),
    );
  }
}
