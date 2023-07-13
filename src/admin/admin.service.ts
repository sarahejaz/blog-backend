import {
  Injectable,
  NotFoundException,
  NotAcceptableException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/user.model';
import { Tag, TagDocument } from './tags.model';

const convertTag = (tag: String) => {
  let allLowerCaseTag = tag.toLowerCase();
  allLowerCaseTag =
    allLowerCaseTag.charAt(0).toUpperCase() + allLowerCaseTag.slice(1);
  return allLowerCaseTag;
};

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('tag') private tagModel: Model<Tag>,
    @InjectModel('user') private userModel: Model<User>
  ) {}

  // ================================================================ TAGS ================================================================
  async createTag(tagName: string) {
    const allLowerCaseTag = convertTag(tagName);

    const tag = await this.tagModel.findOne({
      tagName: { $regex: new RegExp(tagName), $options: 'i' }
    });

    if (!tag) {
      return this.tagModel.create({ tagName: allLowerCaseTag });
    } else {
      throw new NotAcceptableException(`Tag has already been added`);
    }
  }

  async getAllTags(): Promise<Tag[]> {
    return this.tagModel.find().exec();
  }

  async getTagById(id: string): Promise<Tag> {
    if (Types.ObjectId.isValid(id)) {
      const tag = await this.tagModel.findById(id);

      if (!tag) {
        throw new NotFoundException(`Tag not found`);
      }

      return tag;
    } else {
      throw new NotAcceptableException(`Tag id is invalid`);
    }
  }

  async getTag(query: object, type: string): Promise<Tag> {
    if (type === 'name') {
      const tag = await this.tagModel.findOne({
        tagName: { $regex: new RegExp(query['tagName']), $options: 'i' }
      });

      if (!tag) {
        throw new NotFoundException(`Tag not found`);
      }

      return tag;
    } else {
      const tag = await this.tagModel.findOne(query);

      if (!tag) {
        throw new NotFoundException(`Tag not found`);
      }

      return tag;
    }
  }

  async editTag(tagId: string, newTagName: string): Promise<Tag> {
    const allLowerCaseTag = convertTag(newTagName);

    const tag = await this.tagModel.findOne({ tagName: allLowerCaseTag });

    if (!tag) {
      const existingTag = await this.tagModel.findByIdAndUpdate(
        tagId,
        { tagName: allLowerCaseTag },
        { new: true }
      );

      if (!existingTag) {
        throw new NotFoundException(`Tag with id = ${tagId} not found`);
      }

      return existingTag;
    } else {
      throw new NotAcceptableException(`Tag already exists`);
    }
  }

  async deleteTag(tagId: any): Promise<Tag> {
    const deleteTag = await this.tagModel.findByIdAndDelete(tagId);

    if (!deleteTag) {
      throw new NotFoundException('Tag not found');
    }

    return deleteTag;
  }

  // ================================================================ USERS ================================================================
  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async getAllUsersByQuery(query: object): Promise<User[]> {
    return this.userModel.find(query).select('-password').exec();
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(userId, { role: role }, { new: true })
      .select('-password');

    if (!existingUser) {
      throw new NotFoundException(`User with id = ${userId} not found`);
    }

    return existingUser;
  }

  async deleteUser(userId: string): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndDelete(userId)
      .select('-password');

    if (!existingUser) {
      throw new NotFoundException(`User with id = ${userId} not found`);
    }

    return existingUser;
  }
}
