import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserUseCaseCommand } from './usecases/createUserUseCase';
import { BasicAuthGuard } from '../../base/guards/auth-guards/basic.auth.guard';
import { UserOutputModel } from './dto/model/user-output.model';
import { GetAllUsersUseCaseCommand } from './usecases/getAllUsersUseCase';
import { SortUserDto } from './dto/sort-user.dto';

@Controller('sa/users')
export class UserController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  create(@Body() createUserDto: CreateUserDto): Promise<UserOutputModel> {
    return this.commandBus.execute(new CreateUserUseCaseCommand(createUserDto));
  }

  @Get()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  findAll(@Query() sortData: SortUserDto) {
    return this.commandBus.execute(new GetAllUsersUseCaseCommand(sortData));
  }
  //
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
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
