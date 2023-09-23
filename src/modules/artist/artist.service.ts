import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { ArtistConstant } from './constant/artist.constant';
import { ArtistModel } from './schema/artist.schema';

@Injectable()
export class ArtistService extends BaseApiService<ArtistModel> {
  constructor(
    @InjectModel(ArtistConstant.MODEL_NAME)
    readonly _model: Model<ArtistModel>,
  ) {
    super(_model);
  }
}
