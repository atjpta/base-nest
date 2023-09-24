import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
import { CountryConstant } from 'src/modules/country/constant/country.constant';
import { CountryModel } from 'src/modules/country/schema/country.schema';
import { GenreConstant } from 'src/modules/genre/constant/genre.constant';
import { GenreModel } from 'src/modules/genre/schema/genre.schema';
import { SingerConstant } from 'src/modules/singer/constant/singer.constant';
import { SingerModel } from 'src/modules/singer/schema/singer.schema';
import { UserConstant } from 'src/modules/user/constant/user.constant';
import { UserModel } from 'src/modules/user/schema/user.schema';

@Schema()
export class MusicModel extends BaseMongoDbSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: UserConstant.MODEL_NAME,
  })
  createdBy: UserModel;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: SingerConstant.MODEL_NAME,
    },
  ])
  singer: SingerModel[];

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: GenreConstant.MODEL_NAME,
    },
  ])
  genre: GenreModel[];

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: CountryConstant.MODEL_NAME,
    },
  ])
  country: CountryModel[];

  @Prop({
    type: Number,
  })
  view: number;

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
    type: String,
  })
  url: string;
}
