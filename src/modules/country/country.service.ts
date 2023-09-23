import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { CountryConstant } from './constant/country.constant';
import { CountryModel } from './schema/country.schema';

@Injectable()
export class CountryService extends BaseApiService<CountryModel> {
  constructor(
    @InjectModel(CountryConstant.MODEL_NAME)
    readonly _model: Model<CountryModel>,
  ) {
    super(_model);
  }
}
