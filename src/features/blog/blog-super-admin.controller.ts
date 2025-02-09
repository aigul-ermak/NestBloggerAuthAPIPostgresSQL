import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
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
}
