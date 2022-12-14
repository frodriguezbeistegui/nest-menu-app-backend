import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.schema';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req: any) {
    const user = req.user._doc;
    user.id = user._id.toString();
    console.log(user)
    return this.authService.loginWithCredentials(user);
  }

  // @Post('/signin')
  // signin(@Body('email') email: string, @Body('password') password: string) {
  //   return this.authService.validateUser(email, password);
  // }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get('/:id')
  getById(@Param('id') id: ObjectId) {
    return this.usersService.findWIthId(id);
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
