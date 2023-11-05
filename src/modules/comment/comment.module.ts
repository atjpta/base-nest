import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentConstant } from './constant/comment.constant';
import { CommentController } from './comment.controller';
import { CommentModel } from './schema/comment.schema';
import { StatusCommentModule } from '../status-comment/status-comment.module';

@Module({
  imports: [
    StatusCommentModule,
    MongooseModule.forFeature([
      {
        name: CommentConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(CommentModel),
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
