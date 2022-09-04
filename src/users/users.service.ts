import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly UserRepo: Model<User>) {}

  async findAll() {
    let users;
    users = await this.UserRepo.find();
    return users;
  }

  findOne(email: string) {
    return this.UserRepo.find({ email });
  }

  create(name: string, email: string, password: string) {
    const user = this.UserRepo.create({ name, email, password });
    if (!user) {
      throw new NotFoundException("Can't create new user, try again later!");
    }
    return user;
  }

  async findWIthId(id: ObjectId) {
    const user = await this.UserRepo.findById(id)

    if (!user) {
      throw new NotFoundException('User not found, try again later!');
    }
    return user;
  }

  async update(id: ObjectId, atts: Partial<User>) {
    const user = await this.UserRepo.findOneAndUpdate(id, atts);
    if (!user?._id) {
      throw new NotFoundException('User not found');
    }
    return Object.assign(user, atts)
   
  }

  async delete(id: ObjectId) {
    const user = await this.UserRepo.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return null;
  }
}
