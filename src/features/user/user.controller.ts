import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserUseCaseCommand } from './usecases/createUserUseCase';
import { BasicAuthGuard } from '../../base/guards/auth-guards/basic.auth.guard';
import { UserOutputModel } from './dto/model/user-output.model';
import { SortUserDto } from './dto/sort-user.dto';

import { GetAllUsersUseCaseCommand } from './usecases/getAllUsersUseCase';
import { DeleteUserUseCaseCommand } from './usecases/deleteUserUseCase';

@Controller('sa/users')
export class UserController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  create(@Body() createUserDto: CreateUserDto): Promise<UserOutputModel> {
    try {
      return this.commandBus.execute(
        new CreateUserUseCaseCommand(createUserDto),
      );
    } catch (error) {
      console.error('Error in /sa/users:', (error as Error).message);
      throw error;
    }
  }

  @Get()
  @HttpCode(200)
  @UseGuards(BasicAuthGuard)
  findAll(@Query() sortData: SortUserDto) {
    try {
      //TODO delete
      console.error('Get all users');
      return this.commandBus.execute(new GetAllUsersUseCaseCommand(sortData));
    } catch (error) {
      console.error('Error in /sa/users:', (error as Error).message);
      throw error;
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
  //
  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  remove(@Param('id') id: number) {
    return this.commandBus.execute(new DeleteUserUseCaseCommand(id));
  }
}
