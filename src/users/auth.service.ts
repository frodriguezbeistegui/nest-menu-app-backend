import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

interface NewUser {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(body: NewUser) {
    const { password, passwordConfirm, email, name } = body;
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }
    const users = await this.usersService.findAll(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '%' + hash.toString('hex');

    const user = await this.usersService.create(name, email, result);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.findAll(email);
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const [salt, storedHash] = user.password.split('%');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }
}
