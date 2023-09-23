import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistConstant } from './constant/artist.constant';
import { ArtistModel } from './schema/artist.schema';
import { uploadOneImageMiddleware } from '../image/middleware/image.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ArtistConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(ArtistModel),
      },
    ]),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${ArtistConstant.API_PREFIX}`,
        method: RequestMethod.POST,
      })
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${ArtistConstant.API_PREFIX}/:id`,
        method: RequestMethod.PUT,
      });
  }
}
