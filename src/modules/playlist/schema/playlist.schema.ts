import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
import { MusicModel } from 'src/modules/music/schema/music.schema';
import mongoose from 'mongoose';
import { MusicConstant } from 'src/modules/music/constant/music.constant';
import { UserConstant } from 'src/modules/user/constant/user.constant';
import { UserModel } from 'src/modules/user/schema/user.schema';
@Schema()
export class PlaylistModel extends BaseMongoDbSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserConstant.MODEL_NAME,
  })
  createdBy: UserModel;
  @Prop({
    type: String,
    index: 'text',
  })
  name: string;

  @Prop({
    type: String,
  })
  url_image: string;

  @Prop({
    type: Number,
    default: 0,
  })
  view: number;

  @Prop({
    type: Boolean,
    default: true,
  })
  isPublic: boolean;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: MusicConstant.MODEL_NAME,
    },
  ])
  list: MusicModel;
}
