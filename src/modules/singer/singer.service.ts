import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { SingerConstant } from './constant/singer.constant';
import { SingerModel } from './schema/singer.schema';

@Injectable()
export class SingerService extends BaseApiService<SingerModel> {
  constructor(
    @InjectModel(SingerConstant.MODEL_NAME)
    readonly _model: Model<SingerModel>,
  ) {
    super(_model);
  }
}
