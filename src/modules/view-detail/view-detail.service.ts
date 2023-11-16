import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { ViewDetailModel } from './schema/view-detail.schema';
import { ViewDetailConstant } from './constant/view-detail.constant';
import { AppMixin } from 'src/shared/utils/app-mixin';
import { MusicConstant } from '../music/constant/music.constant';
import {
  QueryByMonthAndMusicDto,
  QueryByYearAndMusicDto,
  QueryTopByDateDto,
} from './dto/query-view-detail.dto';

@Injectable()
export class ViewDetailService extends BaseApiService<ViewDetailModel> {
  constructor(
    @InjectModel(ViewDetailConstant.MODEL_NAME)
    readonly _model: Model<ViewDetailModel>,
  ) {
    super(_model);
  }

  public async createOrUpdate(music_id: string) {
    music_id;
    const { day, month, year } = AppMixin.getDayMonthYear();
    const data = { music: this._getID(music_id), day, month, year };
    let record = await this._model.findOneAndUpdate(
      {
        ...data,
      },
      {
        $inc: { view: 1 },
      },
      { new: true },
    );
    if (!record) {
      record = await this._model.create({
        ...data,
      });
    }
    return record;
  }

  public async getTopByDate(query: QueryTopByDateDto) {
    const { top, ...filter } = query;

    const record = await this._model.aggregate([
      {
        $match: {
          ...filter,
        },
      },
      {
        $group: {
          _id: '$music',
          view: { $sum: '$view' },
        },
      },
      {
        $lookup: {
          from: MusicConstant.MODEL_NAME,
          localField: '_id',
          foreignField: '_id',
          as: 'music',
        },
      },
      {
        $unwind: '$music',
      },
      {
        $limit: top,
      },
    ]);
    return record;
  }

  public async getByMonthAndMusic(query: QueryByMonthAndMusicDto) {
    const record = await this._model.find(query).sort('day');
    const music = await this._model
      .findOne({ music: this._getID(query.music) })
      .populate('music');
    return { list: record, music: music.music };
  }

  public async getByYearAndMusic(query: QueryByYearAndMusicDto) {
    const record = await this._model
      .aggregate([
        {
          $match: {
            year: query.year,
            music: this._getID(query.music),
          },
        },
        {
          $group: {
            _id: '$month',
            view: { $sum: '$view' },
          },
        },
      ])
      .sort('_id');

    const music = await this._model.aggregate([
      {
        $match: {
          music: this._getID(query.music),
        },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: MusicConstant.MODEL_NAME,
          localField: 'music',
          foreignField: '_id',
          as: 'music',
        },
      },
      {
        $unwind: '$music',
      },
    ]);

    return { list: record, music: music[0].music };
  }
}
