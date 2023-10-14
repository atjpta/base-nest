import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { NewsConstant } from './constant/news.constant';
import { NewsModel } from './schema/news.schema';
import { uploadOneImageMiddleware } from '../image/middleware/image.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NewsConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(NewsModel),
      },
    ]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${NewsConstant.API_PREFIX}`,
        method: RequestMethod.POST,
      })
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${NewsConstant.API_PREFIX}/:id`,
        method: RequestMethod.PUT,
      });
  }
}
