import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { FavoriteModel } from './schema/favorite.schema';
import { FavoriteConstant } from './constant/favorite.constant';
import { MusicConstant } from '../music/constant/music.constant';

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
      .find({
        modelType: modelType,
        createdBy: this._getID(user),
        model: { $ne: null },
      })
      .populate({
        path: 'model',
        match: { _id: { $ne: null } },
        populate:
          modelType == MusicConstant.MODEL_NAME
            ? {
                path: 'singer genre country',
                select: 'id name',
              }
            : '',
      });
    return records;
  }

  public async findSlBy(model_id: string) {
    const records = await this._model.find({ model: model_id });
    return records.length;
  }

  public async findOneByUser(model_id: string, user: string) {
    const records = await this._model.findOne({
      model: model_id,
      createdBy: user,
    });
    return records;
  }

  public async removeByUser(user_id: string, model: string) {
    const records = await this._model.deleteOne({
      createdBy: this._getID(user_id),
      model,
    });
    return records;
  }
}
