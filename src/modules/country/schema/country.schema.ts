import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';

@Schema()
export class CountryModel extends BaseMongoDbSchema {
  @Prop({
    type: String,
    index: 'text',
  })
  name: string;

  @Prop({
    type: String,
  })
  avatar: string;
}
