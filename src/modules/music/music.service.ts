import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { MusicConstant } from './constant/music.constant';
import { MusicModel } from './schema/music.schema';
import { ViewDetailService } from '../view-detail/view-detail.service';

@Injectable()
export class MusicService extends BaseApiService<MusicModel> {
  constructor(
    @InjectModel(MusicConstant.MODEL_NAME)
    readonly _model: Model<MusicModel>,
    readonly _viewDetailService: ViewDetailService,
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

  public async findAllByModel(
    type: string,
    id: string,
    page: number,
    limit: number,
  ) {
    const skipIndex = (page - 1) * limit;
    const records = await this._model
      .find({ [type]: { $gte: id } })
      .populate('singer genre country', 'id name')
      .sort({ view: -1, createdAt: -1 })
      .limit(limit)
      .skip(skipIndex);
    return records;
  }

  public async findAllByModelCount(type: string, id: string) {
    const records = await this._model.find({ [type]: { $gte: id } });
    return records.length;
  }

  public async updateView(music_id: string) {
    const records = await this._model.findOneAndUpdate(
      { _id: this._getID(music_id) },
      {
        $inc: { view: 1 },
      },
      {
        new: true,
      },
    );
    await this._viewDetailService.createOrUpdate(music_id);
    return records;
  }

  public async findByFilename(filename: string) {
    const record = await this._model.findOne({
      name_origin: filename,
    });
    return record;
  }
}
