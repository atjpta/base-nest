import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { MusicConstant } from './constant/music.constant';
import { MusicModel } from './schema/music.schema';
import { uploadMusicMiddleware } from './middleware/music.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MusicConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(MusicModel),
      },
    ]),
  ],
  controllers: [MusicController],
  providers: [MusicService],
  exports: [MusicService],
})
export class MusicModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadMusicMiddleware)
      .forRoutes({
        path: `${MusicConstant.API_PREFIX}`,
        method: RequestMethod.POST,
      })
      .apply(uploadMusicMiddleware)
      .forRoutes({
        path: `${MusicConstant.API_PREFIX}/:id`,
        method: RequestMethod.PUT,
      });
  }
}
