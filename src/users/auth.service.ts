import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

interface NewUser {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(body: NewUser) {
    const { password, passwordConfirm, email, name } = body;
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }
    const users = await this.usersService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = salt + '%' + hash.toString('hex');

    const user = await this.usersService.create(name, email, result);

    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [salt, storedHash] = user.password.split('%');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Wrong password');
    }
    return user;
  }

  async loginWithCredentials(user: any) {
    const payload = { email: user.email, id: user.id! };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
