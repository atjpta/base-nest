import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import {
  uploadArrayImageMiddleware,
  uploadOneImageMiddleware,
} from './middleware/image.middleware';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService],
})
export class ImageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: '/api/v1/images/upload',
        method: RequestMethod.POST,
      })
      .apply(uploadArrayImageMiddleware)
      .forRoutes({
        path: '/api/v1/images/upload/array',
        method: RequestMethod.POST,
      });
  }
}
