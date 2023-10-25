import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { StatusCommentService } from './status-comment.service';
import { StatusCommentController } from './status-comment.controller';
import { StatusCommentModel } from './schema/status-comment.schema';
import { StatusCommentConstant } from './constant/status-comment.constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StatusCommentConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(StatusCommentModel),
      },
    ]),
  ],
  controllers: [StatusCommentController],
  providers: [StatusCommentService],
  exports: [StatusCommentService],
})
export class StatusCommentModule {}
