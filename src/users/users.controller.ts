import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { get } from 'http';
import { ObjectId } from 'mongoose';
import { AuthService } from './auth.service';
import { UserDto } from './dtos/create-user.dto';
import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  signup(@Body() body: UserDto) {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  signin(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signIn(email, password);
  }

  @Get()
  async getAllUsers(@Query('email') email: string) {
    const users: any = await this.usersService.findAll(email);
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
