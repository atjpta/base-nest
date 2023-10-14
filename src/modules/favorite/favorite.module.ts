import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { FavoriteService } from './favorite.service';
import { FavoriteConstant } from './constant/favorite.constant';
import { FavoriteController } from './favorite.controller';
import { FavoriteModel } from './schema/favorite.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FavoriteConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(FavoriteModel),
      },
    ]),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
