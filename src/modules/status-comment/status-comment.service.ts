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
}
