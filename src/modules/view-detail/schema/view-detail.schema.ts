import { Prop, Schema } from '@nestjs/mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
import mongoose from 'mongoose';
import { MusicModel } from 'src/modules/music/schema/music.schema';
import { MusicConstant } from 'src/modules/music/constant/music.constant';
@Schema()
export class ViewDetailModel extends BaseMongoDbSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: MusicConstant.MODEL_NAME,
  })
  music: MusicModel;

  @Prop({
    type: Number,
  })
  day: number;

  @Prop({
    type: Number,
  })
  month: number;

  @Prop({
    type: Number,
  })
  year: number;

  @Prop({
    type: Number,
    default: 1,
  })
  view: number;
}
