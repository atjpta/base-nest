import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class BaseMongoDbSchema {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: string;

  @Prop({
    type: String,
    default: () => new Date().toISOString(),
  })
  createdAt: string;

  @Prop({
    type: String,
    default: () => new Date().toISOString(),
  })
  updatedAt: string;
}
