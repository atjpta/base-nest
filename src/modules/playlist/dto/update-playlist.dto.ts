import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePlaylistDto } from './create-playlist.dto';
import { IsMongoId } from 'class-validator';

export class UpdatePlaylistDto extends PartialType(
  OmitType(CreatePlaylistDto, ['list']),
) {}

export class UpdateMusicPlaylistDto {
  @IsMongoId()
  @ApiProperty({
    example: true,
    description: 'list music Playlist?',
  })
  music: string;
}
