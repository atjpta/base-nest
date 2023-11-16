import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
@Schema()
export class PermissionModel extends BaseMongoDbSchema {
  @Prop({
    type: String,
  })
  name: string;
}
