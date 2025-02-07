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

@Controller()
export class BlogController {
  constructor(private commandBus: CommandBus) {}

  @Post('sa/blogs')
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

  @Get('blogs/:id')
  findOne(@Param('id') id: number) {
    return this.commandBus.execute(new GetBlogByIdUseCaseCommand(id));
  }

  @Put('sa/blogs/:id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  update(@Param('id') id: number, @Body() updateBlogDto: UpdateBlogDto) {
    return this.commandBus.execute(
      new UpdateBlogUseCaseCommand(id, updateBlogDto),
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return true;
  }
}
