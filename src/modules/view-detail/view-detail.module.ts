import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { ViewDetailService } from './view-detail.service';
import { ViewDetailController } from './view-detail.controller';
import { ViewDetailModel } from './schema/view-detail.schema';
import { ViewDetailConstant } from './constant/view-detail.constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ViewDetailConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(ViewDetailModel),
      },
    ]),
  ],
  controllers: [ViewDetailController],
  providers: [ViewDetailService],
  exports: [ViewDetailService],
})
export class ViewDetailModule {}
