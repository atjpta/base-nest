import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePlaylistDto } from './create-playlist.dto';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId } from 'class-validator';

export class UpdatePlaylistDto extends PartialType(
  OmitType(CreatePlaylistDto, ['list']),
) {}

export class UpdateMusicPlaylistDto {
  @IsArray()
  @Type(() => String)
  @IsMongoId({
    each: true,
  })
  @ApiProperty({
    example: true,
    description: 'list music Playlist?',
  })
  list: string[];
}
