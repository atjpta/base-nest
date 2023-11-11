import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
import mongoose from 'mongoose';
import { UserModel } from 'src/modules/user/schema/user.schema';
import { UserConstant } from 'src/modules/user/constant/user.constant';
@Schema()
export class NotificationModel extends BaseMongoDbSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserConstant.MODEL_NAME,
  })
  user: UserModel;

  @Prop({
    type: String,
  })
  type: string;

  @Prop({
    type: String,
  })
  content: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isView: boolean;
}
