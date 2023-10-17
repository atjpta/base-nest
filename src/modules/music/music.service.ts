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

  public async getRandom(id: string, size: number) {
    const records = await this._model.aggregate([
      {
        $match: {
          _id: { $ne: this._getID(id) },
        },
      },
      {
        $addFields: { id_string: { $toString: '$_id' } },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'id_string',
          foreignField: 'model',
          as: 'comments',
        },
      },
      {
        $addFields: {
          count_comments: { $size: '$comments' },
        },
      },
      {
        $lookup: {
          from: 'artists',
          localField: 'artist',
          foreignField: '_id',
          as: 'artist',
        },
      },
      {
        $lookup: {
          from: 'singers',
          localField: 'singer',
          foreignField: '_id',
          as: 'singer',
        },
      },
      {
        $lookup: {
          from: 'genres',
          localField: 'genre',
          foreignField: '_id',
          as: 'genre',
        },
      },
      {
        $lookup: {
          from: 'countries',
          localField: 'country',
          foreignField: '_id',
          as: 'country',
        },
      },

      { $sample: { size } },
      { $sort: { view: -1, createdAt: -1 } },
    ]);
    return records;
  }
}
