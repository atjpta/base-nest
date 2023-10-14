import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { FavoriteModel } from './schema/favorite.schema';
import { FavoriteConstant } from './constant/favorite.constant';

@Injectable()
export class FavoriteService extends BaseApiService<FavoriteModel> {
  constructor(
    @InjectModel(FavoriteConstant.MODEL_NAME)
    readonly _model: Model<FavoriteModel>,
  ) {
    super(_model);
  }

  public async findModelByUSer(modelType: string, user: string) {
    const records = await this._model
      .find({ modelType: modelType, user: user, model: { $ne: null } })
      .populate({
        path: 'model',
        match: { _id: { $ne: null } },
      });
    return records;
  }

  public async findSlBy(model_id: string) {
    const records = await this._model.find({ model: model_id });
    return records;
  }

  public async findOneByUser(model_id, user) {
    const records = await this._model.findOne({ model: model_id, user: user });
    return records;
  }
}
