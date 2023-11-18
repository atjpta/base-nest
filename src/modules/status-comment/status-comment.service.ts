import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { StatusCommentModel } from './schema/status-comment.schema';
import { StatusCommentConstant } from './constant/status-comment.constant';

@Injectable()
export class StatusCommentService extends BaseApiService<StatusCommentModel> {
  constructor(
    @InjectModel(StatusCommentConstant.MODEL_NAME)
    readonly _model: Model<StatusCommentModel>,
  ) {
    super(_model);
  }

  public async findAllIsWarning(page: number, limit: number) {
    const skipIndex = (page - 1) * limit;
    const records = await this._model
      .find({
        isBanned: false,
        endTime: {
          $gt: new Date().toISOString(),
        },
      })
      .populate('user', '_id username fullName avatar email')
      .limit(limit)
      .skip(skipIndex);

    return records;
  }

  public async findAllIsWarningCount() {
    const records = await this._model.find({
      isBanned: false,
      endTime: {
        $gt: new Date().toISOString(),
      },
    });
    return records.length;
  }

  public async findAllIsBanned(page: number, limit: number) {
    const skipIndex = (page - 1) * limit;
    const records = await this._model
      .find({
        isBanned: true,
      })
      .populate('user', '_id username fullName avatar email')
      .limit(limit)
      .skip(skipIndex);

    return records;
  }

  public async findAllIsBannedCount() {
    const records = await this._model.find({
      isBanned: true,
    });
    return records.length;
  }

  public async check(id: string) {
    const records = await this._model.findOne({
      user: this._getID(id),
      $or: [
        { isBanned: true },
        {
          endTime: {
            $gt: new Date().toISOString(),
          },
        },
      ],
    });

    if (records) {
      return true;
    }
    return false;
  }

  public async findByUser(id: string) {
    const records = await this._model.findOne({ user: this._getID(id) });
    return records;
  }
}
