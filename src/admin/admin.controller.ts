import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Tag } from './tags.model';
import { User } from '../users/user.model';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ================================================================ TAGS ================================================================
  @Post('tag/add')
  async createTag(@Body('tagName') tagName: string): Promise<Tag> {
    const result = await this.adminService.createTag(tagName);
    return result;
  }

  @Get('tag/all')
  async getAllTags(): Promise<Tag[]> {
    const results = await this.adminService.getAllTags();
    return results;
  }

  @Put('tag/edit/:id')
  async editTag(
    @Param() params: any,
    @Body('newTagName') newTagName: string
  ): Promise<Tag> {
    const newTag = await this.adminService.editTag(params.id, newTagName);
    return newTag;
  }

  @Delete('tag/delete/:id')
  async deleteTag(@Param() params: any): Promise<Tag> {
    const deleteTag = await this.adminService.deleteTag(params.id);
    return deleteTag;
  }

  @Get('tag/id/:id')
  async getTagById(@Param() params: any): Promise<Tag> {
    const tag = await this.adminService.getTagById(params.id);
    return tag;
  }

  @Get('tag/name/:name')
  async getTagByName(@Param() params: any): Promise<Tag> {
    const tag = await this.adminService.getTag(
      {
        tagName: params.name.toLowerCase()
      },
      'name'
    );
    return tag;
  }

  // ================================================================ USERS ================================================================
  @Get('user/all')
  async getAllUsers(): Promise<User[]> {
    const users = await this.adminService.getAllUsers();
    return users;
  }

  @Put('user/updateRole')
  async updateUserRole(@Query() query: any): Promise<User> {
    const updatedUser = await this.adminService.updateUserRole(
      query.userId,
      query.role
    );
    return updatedUser;
  }

  @Delete('user/delete/:userId')
  async deleteUser(@Param() params: any): Promise<User> {
    const deleteUser = await this.adminService.deleteUser(params.userId);
    return deleteUser;
  }
}
