import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CreateFileMongoDBDto } from 'src/base/create-dto';

export class CreatePlaylistDto extends CreateFileMongoDBDto {
  @IsString()
  @ApiProperty({
    example: 'Playlist',
    description: 'name Playlist',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'avatar',
  })
  url_image?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({
    type: Number,
    required: false,
    example: 0,
    description: 'view Playlist',
  })
  view: number = 0;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    required: false,
    example: true,
    description: 'isPublic Playlist?',
  })
  isPublic: boolean = true;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  @IsMongoId({
    each: true,
  })
  list: string[] = [];
}
