import {
  Controller,
  Get,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthNullableGuard } from '../../base/guards/auth-guards/jwt-auth-nullable.guard';
import { GetPostByIdUseCaseCommand } from './usecases/getPostByIdUseCase';
import { CommandBus } from '@nestjs/cqrs';

@Controller('posts')
export class PostController {
  constructor(private commandBus: CommandBus) {}

  // @Post()
  // create(@Body() createPostDto: CreatePostDto) {
  //   return this.postService.create(createPostDto);
  // }
  //
  // @Get()
  // findAll() {
  //   return this.postService.findAll();
  // }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthNullableGuard)
  async getPostById(@Param('id') id: number, @Req() req: Request) {
    const userId = req['userId'];

    return await this.commandBus.execute(
      new GetPostByIdUseCaseCommand(id, userId!),
    );
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(+id, updatePostDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.postService.remove(+id);
  // }
}
