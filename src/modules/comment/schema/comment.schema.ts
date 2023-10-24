import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
import { MusicModel } from 'src/modules/music/schema/music.schema';
import mongoose from 'mongoose';
import { UserModel } from 'src/modules/user/schema/user.schema';
import { UserConstant } from 'src/modules/user/constant/user.constant';
import { CommentConstant } from '../constant/comment.constant';
@Schema()
export class CommentModel extends BaseMongoDbSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserConstant.MODEL_NAME,
  })
  createdBy: UserModel;

  @Prop({
    type: String,
  })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'modelType',
  })
  model: MusicModel & CommentModel;

  @Prop({
    type: String,
    enum: CommentConstant.SCHEMA_MODEL_TYPE,
  })
  modelType: string;
}
