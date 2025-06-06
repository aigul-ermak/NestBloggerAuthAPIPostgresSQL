import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../base/guards/auth-guards/basic.auth.guard';
import { CreateBlogUseCaseCommand } from './usecases/createBlogUseCase';
import { GetBlogByIdUseCaseCommand } from './usecases/getBlogByIdUseCase';
import { BlogOutputModel } from './dto/blog-output.model';
import { UpdateBlogUseCaseCommand } from './usecases/updateBlogUseCase';
import { DeleteBlogByIdUseCaseCommand } from './usecases/deleteBlogByIdUseCase';
import { SortBlogsDto } from './dto/sort-blog.input.dto';
import { GetAllBlogsUseCaseCommand } from './usecases/getAllBlogsUseCase';
import { CreatePostToBlogDto } from './dto/create-post-blog.dto';
import { PostToBlogInputType } from './dto/types/postToBlogInputType';
import { CreatePostUseCaseCommand } from '../post/usecases/createPostUseCase';
import { UpdatePostForBlogUseCaseCommand } from '../post/usecases/updatePostForBlogUseCase';
import { UpdatePostForBlogType } from '../post/dto/types/updatePostForBlogType';
import { DeletePostForBlogUseCaseCommand } from './usecases/deletePostByIdUseCase';

@Controller('sa/blogs')
export class BlogSuperAdminController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() createBlogDto: CreateBlogDto): Promise<BlogOutputModel> {
    const newBlogId = await this.commandBus.execute(
      new CreateBlogUseCaseCommand(createBlogDto),
    );

    const blog = await this.commandBus.execute(
      new GetBlogByIdUseCaseCommand(newBlogId),
    );

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  @Get()
  @UseGuards(BasicAuthGuard)
  findAll(@Query() sortData: SortBlogsDto) {
    return this.commandBus.execute(new GetAllBlogsUseCaseCommand(sortData));
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  update(
    @Param('id') id: number,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<boolean> {
    console.log(updateBlogDto);
    return this.commandBus.execute(
      new UpdateBlogUseCaseCommand(id, updateBlogDto),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  remove(@Param('id') id: number): Promise<boolean> {
    return this.commandBus.execute(new DeleteBlogByIdUseCaseCommand(id));
  }

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  async createPostForBlog(
    @Param('id') blogId: number,
    @Body()
    createPostToBlogDto: CreatePostToBlogDto,
  ) {
    const createdPost: PostToBlogInputType = {
      ...createPostToBlogDto,
      blogId,
    };

    return await this.commandBus.execute(
      new CreatePostUseCaseCommand(createdPost),
    );
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updatePostForBlog(
    @Param('blogId') blogId: number,
    @Param('postId') postId: number,
    @Body() updatePostToBlogDto: CreatePostToBlogDto,
  ): Promise<void> {
    // TODO add type
    const updatePostForBlog: UpdatePostForBlogType = {
      blogId,
      postId,
      title: updatePostToBlogDto.title,
      shortDescription: updatePostToBlogDto.shortDescription,
      content: updatePostToBlogDto.content,
    };

    return this.commandBus.execute(
      new UpdatePostForBlogUseCaseCommand(updatePostForBlog),
    );
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deletePostForBlog(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.commandBus.execute(
      new DeletePostForBlogUseCaseCommand(blogId, postId),
    );
  }
}
