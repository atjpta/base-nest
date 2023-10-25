import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
import mongoose from 'mongoose';
import { UserModel } from 'src/modules/user/schema/user.schema';
import { UserConstant } from 'src/modules/user/constant/user.constant';
import { CommentModel } from 'src/modules/comment/schema/comment.schema';
import { CommentConstant } from 'src/modules/comment/constant/comment.constant';
@Schema()
export class ReportModel extends BaseMongoDbSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserConstant.MODEL_NAME,
  })
  createdBy: UserModel;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserConstant.MODEL_NAME,
  })
  author: UserModel;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: CommentConstant.MODEL_NAME,
  })
  comment: CommentModel;

  @Prop({
    type: String,
  })
  content: string;
}
