import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { ReportModel } from './schema/report.schema';
import { ReportConstant } from './constant/report.constant';
import { UserConstant } from '../user/constant/user.constant';
import { CommentConstant } from '../comment/constant/comment.constant';
import { StatusCommentConstant } from '../status-comment/constant/status-comment.constant';

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
        $group: {
          _id: '$author',
          count_reports: { $sum: 1 },
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
        $lookup: {
          from: StatusCommentConstant.MODEL_NAME,
          localField: '_id',
          foreignField: 'user',
          as: 'status',
        },
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          _id: 0,
          author: 1,
          count_reports: 1,
          status: 1,
        },
      },
      {
        $match: {
          $or: [
            { 'status.0': { $exists: false } },
            {
              $and: [
                { 'status.0.isBanned': false },
                { 'status.0.endTime': { $lt: new Date().toISOString() } },
              ],
            },
          ],
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
    const record = await this._model.aggregate([
      {
        $group: {
          _id: '$author',
          reports: { $push: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: StatusCommentConstant.MODEL_NAME,
          localField: '_id',
          foreignField: 'user',
          as: 'status',
        },
      },
      {
        $match: {
          $or: [
            { 'status.0': { $exists: false } },
            {
              $and: [
                { 'status.0.isBanned': false },
                { 'status.0.endTime': { $lt: new Date().toISOString() } },
              ],
            },
          ],
        },
      },
    ]);
    return record.length;
  }

  public async getOneByAuthor(author_id: string) {
    const author_oid = this._getID(author_id);
    const record = await this._model.aggregate([
      {
        $match: {
          author: author_oid,
        },
      },

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
        $unwind: '$createdBy',
      },

      {
        $group: {
          _id: '$comment',
          reports: { $push: '$$ROOT' },
        },
      },

      {
        $lookup: {
          from: CommentConstant.MODEL_NAME,
          localField: '_id',
          foreignField: '_id',
          as: 'comment',
        },
      },
      {
        $unwind: '$comment',
      },
    ]);
    return record;
  }

  public async deleteByAuthor(id: string) {
    const record = await this._model.deleteMany({
      author: this._getID(id),
    });
    return record;
  }

  public async deleteByComment(id: string) {
    const record = await this._model.deleteMany({
      comment: this._getID(id),
    });
    return record;
  }
}
