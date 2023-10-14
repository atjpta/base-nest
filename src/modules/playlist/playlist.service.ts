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
        $set: {
          list: data.list,
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
        $pullAll: {
          list: data.list,
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
}
