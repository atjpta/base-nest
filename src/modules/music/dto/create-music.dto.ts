import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateFilesArrayMongoDBDto } from 'src/base/create-dto';

export class CreateMusicDto extends CreateFilesArrayMongoDBDto {
  @IsString()
  @ApiProperty({
    required: false,
    description: 'name Music ',
  })
  name?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'view song',
  })
  view?: number = 0;

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'genre',
  })
  genre?: string[];

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'singer',
  })
  singer?: string[];

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'country',
  })
  country?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'url image',
  })
  url_image?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'url song',
  })
  url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'name_origin song',
  })
  name_origin?: string;
}
