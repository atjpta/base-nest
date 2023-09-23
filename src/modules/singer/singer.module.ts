import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { SingerController } from './singer.controller';
import { SingerService } from './singer.service';
import { SingerConstant } from './constant/singer.constant';
import { SingerModel } from './schema/singer.schema';
import { uploadOneImageMiddleware } from '../image/middleware/image.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SingerConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(SingerModel),
      },
    ]),
  ],
  controllers: [SingerController],
  providers: [SingerService],
  exports: [SingerService],
})
export class SingerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${SingerConstant.API_PREFIX}`,
        method: RequestMethod.POST,
      })
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${SingerConstant.API_PREFIX}/:id`,
        method: RequestMethod.PUT,
      });
  }
}
