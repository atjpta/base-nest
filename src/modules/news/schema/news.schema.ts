import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';

@Schema()
export class NewsModel extends BaseMongoDbSchema {
  @Prop({
    type: String,
  })
  image: string;
}
