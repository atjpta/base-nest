import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { GenreConstant } from './constant/genre.constant';
import { GenreModel } from './schema/genre.schema';

@Injectable()
export class GenreService extends BaseApiService<GenreModel> {
  constructor(
    @InjectModel(GenreConstant.MODEL_NAME)
    readonly _model: Model<GenreModel>,
  ) {
    super(_model);
  }
}
