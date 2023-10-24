import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
import { MusicModel } from 'src/modules/music/schema/music.schema';
import mongoose from 'mongoose';
import { UserModel } from 'src/modules/user/schema/user.schema';
import { UserConstant } from 'src/modules/user/constant/user.constant';
import { PlaylistModel } from 'src/modules/playlist/schema/playlist.schema';
import { SingerModel } from 'src/modules/singer/schema/singer.schema';
import { CommentModel } from 'src/modules/comment/schema/comment.schema';
import { FavoriteConstant } from '../constant/favorite.constant';
@Schema()
export class FavoriteModel extends BaseMongoDbSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserConstant.MODEL_NAME,
  })
  createdBy: UserModel;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'modelType',
  })
  model: MusicModel & PlaylistModel & SingerModel & CommentModel;

  @Prop({
    type: String,
    enum: FavoriteConstant.SCHEMA_MODEL_TYPE,
  })
  modelType: string;
}
