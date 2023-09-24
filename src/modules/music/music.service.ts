import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { MusicConstant } from './constant/music.constant';
import { MusicModel } from './schema/music.schema';

@Injectable()
export class MusicService extends BaseApiService<MusicModel> {
  constructor(
    @InjectModel(MusicConstant.MODEL_NAME)
    readonly _model: Model<MusicModel>,
  ) {
    super(_model);
  }
}
