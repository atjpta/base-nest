import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';

@Schema()
export class RoleModel extends BaseMongoDbSchema {
  @Prop({
    type: String,
    unique: true,
  })
  name: string;
}
