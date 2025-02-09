import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { GetBlogByIdUseCaseCommand } from './usecases/getBlogByIdUseCase';
import { SortBlogsDto } from './dto/sort-blog.input.dto';
import { GetAllBlogsUseCaseCommand } from './usecases/getAllBlogsUseCase';
import { Blog } from './entities/blog.entity';
import { BlogOutputModel } from './dto/blog-output.model';

@Controller('blogs')
export class BlogController {
  constructor(private commandBus: CommandBus) {}

  @Get()
  findAll(@Query() sortData: SortBlogsDto) {
    return this.commandBus.execute(new GetAllBlogsUseCaseCommand(sortData));
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.commandBus.execute(new GetBlogByIdUseCaseCommand(id));
  }
}
