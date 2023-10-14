import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { PlaylistService } from './playlist.service';
import { uploadOneImageMiddleware } from '../image/middleware/image.middleware';
import { PlaylistConstant } from './constant/playlist.constant';
import { PlaylistController } from './playlist.controller';
import { PlaylistModel } from './schema/playlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PlaylistConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(PlaylistModel),
      },
    ]),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService],
  exports: [PlaylistService],
})
export class PlaylistModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${PlaylistConstant.API_PREFIX}`,
        method: RequestMethod.POST,
      })
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${PlaylistConstant.API_PREFIX}/:id`,
        method: RequestMethod.PUT,
      });
  }
}
