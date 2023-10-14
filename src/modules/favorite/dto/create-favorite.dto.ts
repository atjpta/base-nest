import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { FavoriteConstant } from '../constant/favorite.constant';

export class CreateFavoriteDto {
  @IsMongoId()
  @ApiProperty({
    description: 'model',
  })
  model?: string;

  @IsString()
  @ApiProperty({
    description: 'modelType',
    enum: FavoriteConstant.SCHEMA_MODEL_TYPE,
  })
  modelType?: string;
}
