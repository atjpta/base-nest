import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationModel } from './schema/notification.schema';
import { NotificationConstant } from './constant/notification.constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NotificationConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(NotificationModel),
      },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
