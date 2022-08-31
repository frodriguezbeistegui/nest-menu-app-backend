import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private UserRepo: Model<UserDocument>) {}

  async findAll(email: string) {
    let users;
    if (email) {
      users = await this.UserRepo.find({ email });
    } else {
      users = await this.UserRepo.find();
    }
    return users;
  }

  create(name: string, email: string, password: string) {
    const user = this.UserRepo.create({ name, email, password });
    if (!user) {
      throw new NotFoundException("Can't create new user, try again later!");
    }
    return user;
  }

  findById(id: ObjectId) {
    const user = this.UserRepo.findById(id);
    if (!user) {
      throw new NotFoundException('User not found, try again later!');
    }
    return user;
  }

  async update(id: ObjectId, atts: Partial<User>) {
    const user = await this.UserRepo.findOneAndUpdate(id, atts);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return Object.assign(user, atts);
  }

  async delete(id: ObjectId) {
    const user = await this.UserRepo.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return null;
  }
}
