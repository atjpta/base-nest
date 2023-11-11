import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { NotificationModel } from './schema/notification.schema';
import { NotificationConstant } from './constant/notification.constant';

@Injectable()
export class NotificationService extends BaseApiService<NotificationModel> {
  constructor(
    @InjectModel(NotificationConstant.MODEL_NAME)
    readonly _model: Model<NotificationModel>,
  ) {
    super(_model);
  }

  public async findByUser(id: string) {
    const records = await this._model
      .find({
        user: this._getID(id),
      })
      .sort('-createdAt')
      .limit(50);
    return records;
  }

  public async deleteByUser(id: string) {
    const records = await this._model.deleteMany({
      user: this._getID(id),
    });
    return records;
  }

  public async updateViewByUser(id: string) {
    const records = await this._model.updateMany(
      {
        user: this._getID(id),
      },
      {
        isView: true,
      },
    );
    return records;
  }

  public async updateViewById(id: string) {
    const records = await this._model.updateOne(
      {
        _id: this._getID(id),
      },
      {
        isView: true,
      },
    );
    return records;
  }
}
