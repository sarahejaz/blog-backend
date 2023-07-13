import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Res,
  Query
} from '@nestjs/common';
import { Blog } from './blog.model';
import { BlogService } from './blog.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';
import { Blob } from 'buffer';
import { convert } from 'html-to-text';
import { VerifyTokenGuard } from '../common/VerifyTokenGuard.guard';
import { multerOptions } from '../config/multer.config';

function titleToSlug(title: string): string {
  let slug = title
    .trim() // remove whitespaces at the start and end of string
    .toLowerCase()
    .replace(/^-+/g, '') // remove one or more dash at the start of the string
    .replace(/[^\w-]+/g, '-') // convert any on-alphanumeric character to a dash
    .replace(/-+/g, '-') // convert consecutive dashes to singuar one
    .replace(/-+$/g, '');
  slug = slug + '-' + uuid();
  return slug;
}

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(VerifyTokenGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  async createBlog(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('date') date: string,
    @Body('dateUpdated') dateUpdated: string,
    @Body('userId') userId: string,
    @Body('tags') tags: string[],
    @Body('photo') photo: string,
    @Headers() headers: any,
    @UploadedFile() image: any
  ): Promise<Blog> {
    //const img = URL.createObjectURL(new File(image, { type: 'image/*' }));
    const text = convert(content);
    const result = await this.blogService.createBlog(
      title,
      content,
      image,
      date,
      dateUpdated,
      titleToSlug(title),
      userId,
      text,
      tags
    );
    return result;
  }

  @Get('id/:id')
  async getBlogById(@Param() params: any): Promise<Blog> {
    const blog = await this.blogService.getBlogById(params.id);
    return blog;
  }

  @Get('slug/:slug')
  async getBlogBySlug(@Param() params: any): Promise<Blog> {
    const blog = await this.blogService.getBlog({ slug: params.slug });
    return blog;
  }

  @Get('user/:userId')
  async getBlogsOfUser(@Param() params: any): Promise<Blog[]> {
    const blogs = await this.blogService.findAllByQuery({
      userId: params.userId
    });
    return blogs;
  }

  @Get('allblogs')
  async getAllBlogs(): Promise<Blog[]> {
    const blogs = await this.blogService.findAll();
    return blogs;
  }

  @UseGuards(VerifyTokenGuard)
  @Put('edit/:id')
  @UseInterceptors(FileInterceptor('photo', multerOptions))
  async editBlog(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('tags') tags: Array<string>,
    @Body('dateUpdated') dateUpdated: string,
    @Param() params: any,
    @Headers() headers: any,
    @UploadedFile() image: any
  ): Promise<Blog> {
    const text = convert(content);
    const newBlog = {
      title: title,
      content: content,
      image: image,
      tags: tags,
      plainText: text,
      dateUpdated: dateUpdated
    };

    const blog = await this.blogService.updateBlog(params.id, newBlog);
    return blog;
  }

  @UseGuards(VerifyTokenGuard)
  @Delete('delete/:id')
  async deleteBlog(@Param() params: any): Promise<Blog> {
    const blog = await this.blogService.deleteBlog(params.id);
    return blog;
  }

  @Get('searchBlogs')
  async searchBlogs(@Query() query: any): Promise<Blog[]> {
    let filter = [];
    const tagsArray = query.tags?.includes(',')
      ? query.tags.split(',')
      : [query.tags];

    if (query.searchQueryText) {
      filter = filter.concat({
        $search: {
          index: 'default',
          text: {
            query: query.searchQueryText,
            path: 'title'
          }
        }
      });
      if (query.sortBy) {
        let obj = {};
        if (query.sortBy.toLowerCase().match('dateascending'))
          obj = {
            $sort: { date: 1 }
          };

        if (query.sortBy.toLowerCase().match('datedescending'))
          obj = {
            $sort: { date: -1 }
          };

        filter = filter.concat(obj);

        if (query.tags) {
          filter = filter.concat({ $match: { tags: { $all: tagsArray } } });
        }
      } else {
        filter = [
          {
            $search: {
              index: 'default',
              text: {
                query: query.searchQueryText,
                path: 'title'
              }
            }
          }
        ];
      }

      const blogs = await this.blogService.searchQuery(filter);
      return blogs;
    } else {
      // query text is empty
      if (query.sortBy) {
        let sortObj = {};
        if (query.sortBy.toLowerCase().match('dateascending'))
          sortObj = { date: 'ascending' };
        if (query.sortBy.toLowerCase().match('datedescending'))
          sortObj = { date: 'descending' };

        let tagQuery = {};
        if (query.tags) {
          tagQuery = {
            tags: { $all: tagsArray }
          };

          const blogs = await this.blogService.findAllByQueryWithSort(
            tagQuery,
            sortObj
          );
          return blogs;
        }

        const blogs = await this.blogService.findAllByQueryWithSort(
          {},
          sortObj
        );
        return blogs;
      }

      if (query.tags) {
        let tagQuery = {};
        tagQuery = { tags: { $all: tagsArray } };
        const blogs = await this.blogService.findAllByQuery(tagQuery);
        return blogs;
      }

      const blogs = await this.blogService.findAll();
      return blogs;
    }
  }

  @Get('image/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploads' });
  }
}
