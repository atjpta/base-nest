import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { PlaylistModel } from './schema/playlist.schema';
import { PlaylistConstant } from './constant/playlist.constant';
import { UpdateMusicPlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistService extends BaseApiService<PlaylistModel> {
  constructor(
    @InjectModel(PlaylistConstant.MODEL_NAME)
    readonly _model: Model<PlaylistModel>,
  ) {
    super(_model);
  }

  public async addMusic(id: string, data: UpdateMusicPlaylistDto) {
    const records = await this._model.findByIdAndUpdate(
      this._getID(id),
      {
        $addToSet: {
          list: data.music,
        },
      },
      { new: true },
    );
    return records;
  }

  public async removeMusic(id: string, data: UpdateMusicPlaylistDto) {
    const records = await this._model.findByIdAndUpdate(
      this._getID(id),
      {
        $pull: {
          list: data.music,
        },
      },
      { new: true },
    );
    return records;
  }

  public async findOne(id: string) {
    const record = await this._model.findOne(this._getID(id)).populate({
      path: 'list',
      populate: {
        path: 'singer genre country',
        select: 'id name',
      },
    });
    return record;
  }

  public async findAllByUser(id: string) {
    const record = await this._model.find({
      createdBy: this._getID(id),
    });
    return record;
  }

  public async findAllSearch(
    user_id: string,
    key: string,
    page: number,
    limit: number,
    populate?: string,
  ) {
    const skipIndex = (page - 1) * limit;
    const condition = key ? { $text: { $search: key } } : {};

    const records = await this._model
      .find({ ...condition, createdBy: this._getID(user_id) })
      .populate(populate)
      .sort('-createdAt')
      .limit(limit)
      .skip(skipIndex)
      .exec();
    return records;
  }

  public async findAllSearchCount(
    key: string,
    user_id: string,
  ): Promise<number> {
    const condition = key ? { $text: { $search: key } } : {};
    const records = await this._model
      .find({ ...condition, createdBy: this._getID(user_id) })
      .exec();
    return records.length;
  }

  public async findMusicById(id: string) {
    const records = await this._model
      .findOne({ _id: this._getID(id) })
      .populate({
        path: 'list',
        populate: {
          path: 'singer genre country',
          select: 'id name',
        },
      })
      .exec();
    return records;
  }
}
