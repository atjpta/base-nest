import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
import mongoose from 'mongoose';
import { UserModel } from 'src/modules/user/schema/user.schema';
import { UserConstant } from 'src/modules/user/constant/user.constant';
@Schema()
export class StatusCommentModel extends BaseMongoDbSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserConstant.MODEL_NAME,
    unique: true,
  })
  user: UserModel;

  @Prop({ type: String })
  endTime: string;

  @Prop({ type: Number, default: 1 })
  times: number;

  @Prop({ type: Boolean, default: false })
  isBanned: boolean;
}
