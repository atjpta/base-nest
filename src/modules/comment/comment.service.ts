import { FavoriteConstant } from './../favorite/constant/favorite.constant';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { CommentModel } from './schema/comment.schema';
import { CommentConstant } from './constant/comment.constant';
import { UserConstant } from '../user/constant/user.constant';

@Injectable()
export class CommentService extends BaseApiService<CommentModel> {
  constructor(
    @InjectModel(CommentConstant.MODEL_NAME)
    readonly _model: Model<CommentModel>,
  ) {
    super(_model);
  }

  public async findAllById(id: string) {
    const records = await this._model.aggregate([
      {
        $match: {
          model: id,
        },
      },
      {
        $lookup: {
          from: UserConstant.MODEL_NAME,
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },

      {
        $unwind: {
          path: '$createdBy',
        },
      },

      {
        $lookup: {
          from: CommentConstant.MODEL_NAME,
          let: { modelId: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$model', '$$modelId'] },
              },
            },
            {
              $group: {
                _id: '$model',
                count: { $sum: 1 },
              },
            },
          ],
          as: 'child',
        },
      },
      {
        $lookup: {
          from: FavoriteConstant.MODEL_NAME,
          let: { modelId: { $toString: '$_id' } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$model', '$$modelId'] },
              },
            },
            {
              $group: {
                _id: '$model',
                count: { $sum: 1 },
              },
            },
          ],
          as: 'favorite',
        },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          child: 1,
          createdAt: 1,
          'createdBy._id': 1,
          'createdBy.fullName': 1,
          'createdBy.avatar': 1,
          favorite: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return records;
  }
}
