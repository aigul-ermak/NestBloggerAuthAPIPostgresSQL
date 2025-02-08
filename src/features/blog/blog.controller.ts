import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetBlogByIdUseCaseCommand } from './usecases/getBlogByIdUseCase';
import { SortBlogsDto } from './dto/sort-blog.input.dto';
import { GetAllBlogsUseCaseCommand } from './usecases/getAllBlogsUseCase';

@Controller('blogs')
export class BlogController {
  constructor(private commandBus: CommandBus) {}

  // @Post('sa/blogs')
  // @UseGuards(BasicAuthGuard)
  // async create(@Body() createBlogDto: CreateBlogDto): Promise<BlogOutputModel> {
  //   const newBlogId = await this.commandBus.execute(
  //     new CreateBlogUseCaseCommand(createBlogDto),
  //   );
  //
  //   const blog = await this.commandBus.execute(
  //     new GetBlogByIdUseCaseCommand(newBlogId),
  //   );
  //
  //   if (!blog) {
  //     throw new NotFoundException('Blog not found');
  //   }
  //
  //   return blog;
  // }

  @Get()
  findAll(@Query() sortData: SortBlogsDto) {
    return this.commandBus.execute(new GetAllBlogsUseCaseCommand(sortData));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commandBus.execute(new GetBlogByIdUseCaseCommand(id));
  }

  // @Put('sa/blogs/:id')
  // @HttpCode(204)
  // @UseGuards(BasicAuthGuard)
  // update(@Param('id') id: number, @Body() updateBlogDto: UpdateBlogDto) {
  //   return this.commandBus.execute(
  //     new UpdateBlogUseCaseCommand(id, updateBlogDto),
  //   );
  // }

  // @Delete('sa/blogs/:id')
  // @HttpCode(204)
  // @UseGuards(BasicAuthGuard)
  // remove(@Param('id') id: number) {
  //   return this.commandBus.execute(new DeleteBlogByIdUseCaseCommand(id));
  // }
}
