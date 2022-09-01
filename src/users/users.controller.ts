import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User, UserDocument } from './user.schema';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  signin(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signIn(email, password);
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get('/:id')
  getById(@Param('id') id: ObjectId) {
    return this.usersService.findById(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: ObjectId, @Body() atts: Partial<User>) {
    return this.usersService.update(id, atts);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: ObjectId) {
    return this.usersService.delete(id);
  }
}
