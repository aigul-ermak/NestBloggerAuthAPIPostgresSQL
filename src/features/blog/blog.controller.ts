import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CommandBus } from '@nestjs/cqrs';
import { BasicAuthGuard } from '../../base/guards/auth-guards/basic.auth.guard';
import { CreateBlogUseCaseCommand } from './usecases/createBlogUseCase';
import { GetBlogByIdUseCaseCommand } from './usecases/getBlogByIdUseCase';
import { BlogOutputModel } from './dto/blog-output.model';

@Controller('sa/blogs')
export class BlogController {
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
  findAll() {
    return true;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return true;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return true;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return true;
  }
}
