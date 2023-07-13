import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../users/user.model';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop()
  title: string;

  @Prop()
  content: string; //html

  @Prop()
  plainText: string;

  @Prop({ type: Object })
  image: Object;

  @Prop()
  date: string;

  @Prop()
  dateUpdated: string;

  @Prop()
  slug: string;

  @Prop()
  author: string;

  @Prop({ type: Object })
  imageObj: { data: Buffer; contentType: String };

  // @Prop()
  // imageUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop()
  tags: string[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
