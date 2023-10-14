import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { NewsConstant } from './constant/news.constant';
import { NewsModel } from './schema/news.schema';

@Injectable()
export class NewsService extends BaseApiService<NewsModel> {
  constructor(
    @InjectModel(NewsConstant.MODEL_NAME)
    readonly _model: Model<NewsModel>,
  ) {
    super(_model);
  }
}
