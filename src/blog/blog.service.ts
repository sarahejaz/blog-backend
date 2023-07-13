import { Model, Types } from 'mongoose';
import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  Controller,
  Get,
  StreamableFile,
  Res
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/user.model';
import { Blog, BlogDocument } from './blog.model';
import { UsersService } from '../users/users.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import fs from 'fs';
import { Blob } from 'buffer';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel('blog') private blogModel: Model<Blog>,
    private userService: UsersService
  ) {}

  async createBlog(
    title: string,
    content: string,
    image: File,
    date: string,
    dateUpdated: string,
    slug: string,
    userId: string,
    plainText: string,
    tags: Array<string>
  ): Promise<Blog> {
    const user = await this.userService.getUser({ _id: userId });

    // var new_img = { data: null, contentType: '' };
    // new_img.data = fs.readFileSync(image);
    // new_img.contentType = 'image/*';

    return this.blogModel.create({
      title: title,
      content: content,
      image: image,
      date: date,
      dateUpdated: dateUpdated,
      slug: slug,
      userId: userId,
      author: user ? user.firstName + ' ' + user.lastName : 'Unknown',
      plainText: plainText,
      tags: tags
    });
  }

  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  async getBlog(query: object): Promise<Blog> {
    const blog = await this.blogModel.findOne(query);

    // if (blog.image) {
    //   // if (blog.image.hasOwnProperty('path')) {
    //   //   const file = createReadStream(
    //   //     join(process.cwd(), `${blog.image['path']}`)
    //   //   );
    //   //   // res.set({
    //   //   //   'Content-Type': 'application/json',
    //   //   //   'Content-Disposition': 'attachment; filename="package.json"'
    //   //   // });
    //   //   blog.image = new StreamableFile(file);
    //   // }
    //   URL.createObjectURL(new Blob(blog.image, { type: 'image/*' }));
    // }

    if (!blog) {
      throw new NotFoundException(`Blog not found`);
    }

    return blog;
  }

  async getBlogById(id: string): Promise<Blog> {
    if (Types.ObjectId.isValid(id)) {
      const blog = await this.blogModel.findById(id);

      if (!blog) {
        throw new NotFoundException(`Blog not found`);
      }

      return blog;
    } else {
      throw new NotAcceptableException(`Blog id is invalid`);
    }
  }

  async findAllByQuery(query: object): Promise<Blog[]> {
    const allBlogs = await this.blogModel.find(query).exec();

    if (!allBlogs) {
      throw new NotFoundException(`No blogs found`);
    }

    return allBlogs;
  }

  async findAllByQueryWithSort(query: object, sortObj: any): Promise<Blog[]> {
    const allBlogs = await this.blogModel.find(query).sort(sortObj).exec();

    if (!allBlogs) {
      throw new NotFoundException(`No blogs found`);
    }

    return allBlogs;
  }

  async searchQuery(query: any): Promise<Blog[]> {
    const allBlogs = await this.blogModel.aggregate(query).exec();

    if (!allBlogs) {
      throw new NotFoundException(`No blogs found`);
    }

    return allBlogs;
  }

  async updateBlog(blogId: string, updateBlog: object): Promise<Blog> {
    const existingBlog = await this.blogModel.findByIdAndUpdate(
      blogId,
      updateBlog,
      { new: true }
    );

    if (!existingBlog) {
      throw new NotFoundException(`Blog with id = ${blogId} not found`);
    }

    return existingBlog;
  }

  async deleteBlog(blogId: string): Promise<Blog> {
    const deleteBlog = await this.blogModel.findByIdAndDelete(blogId);

    if (!deleteBlog) {
      throw new NotFoundException(`Blog not found`);
    }

    return deleteBlog;
  }
}
