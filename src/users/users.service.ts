import {
  Injectable,
  NotAcceptableException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>
  ) {}

  async createUser(
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<User> {
    return this.userModel.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: 'user'
    });
  }

  async getUser(query: object): Promise<User> {
    return this.userModel.findOne(query);
  }

  async getUserById(id: any): Promise<User> {
    if (Types.ObjectId.isValid(id)) {
      const user = await this.userModel.findById(id).select('-password');

      if (!user) {
        throw new NotFoundException(`Blog not found`);
      }

      return user;
    } else {
      throw new NotAcceptableException(`Blog id is invalid`);
    }
  }

  async getUserByQuery(query: object): Promise<User> {
    const user = await this.userModel.findOne(query).select('-password');

    if (!user) {
      throw new NotFoundException(`Blog not found`);
    }

    return user;
  }

  async checkExistingEmail(email: string): Promise<any> {
    const user = await this.getUser({ email });

    if (user) {
      throw new NotAcceptableException('Email already in use');
    }

    return null;
  }
}
