import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { GenreConstant } from './constant/genre.constant';
import { GenreModel } from './schema/genre.schema';
import { uploadOneImageMiddleware } from '../image/middleware/image.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GenreConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(GenreModel),
      },
    ]),
  ],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${GenreConstant.API_PREFIX}`,
        method: RequestMethod.POST,
      })
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${GenreConstant.API_PREFIX}/:id`,
        method: RequestMethod.PUT,
      });
  }
}
