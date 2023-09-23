import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { CountryConstant } from './constant/country.constant';
import { CountryModel } from './schema/country.schema';
import { uploadOneImageMiddleware } from '../image/middleware/image.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CountryConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(CountryModel),
      },
    ]),
  ],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${CountryConstant.API_PREFIX}`,
        method: RequestMethod.POST,
      })
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: `${CountryConstant.API_PREFIX}/:id`,
        method: RequestMethod.PUT,
      });
  }
}
