import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import {
  uploadArraySongMiddleware,
  uploadOneSongMiddleware,
} from './middleware/song.middleware';

@Module({
  controllers: [SongController],
  providers: [SongService],
  exports: [SongService],
})
export class SongModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadOneSongMiddleware)
      .forRoutes({
        path: '/api/v1/songs/upload',
        method: RequestMethod.POST,
      })
      .apply(uploadArraySongMiddleware)
      .forRoutes({
        path: '/api/v1/songs/upload/array',
        method: RequestMethod.POST,
      });
  }
}
