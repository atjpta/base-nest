import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { ReportModel } from './schema/report.schema';
import { ReportConstant } from './constant/report.constant';
import { UserConstant } from '../user/constant/user.constant';

@Injectable()
export class ReportService extends BaseApiService<ReportModel> {
  constructor(
    @InjectModel(ReportConstant.MODEL_NAME)
    readonly _model: Model<ReportModel>,
  ) {
    super(_model);
  }

  public async findAllGroup(page: number, limit: number) {
    const record = await this._model.aggregate([
      {
        $lookup: {
          from: UserConstant.MODEL_NAME,
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
        },
      },

      {
        $group: {
          _id: '$author',
          reports: { $push: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: UserConstant.MODEL_NAME,
          localField: '_id',
          foreignField: '_id',
          as: 'author',
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
        },
      },

      {
        $project: {
          _id: 0,
          author: 1,
          reports: 1,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);
    return record;
  }

  public async findAllGroupCount() {
    const record = await this._model.find({});
    return record.length;
  }
}
