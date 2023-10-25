import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class CreateReportDto {
  @IsMongoId()
  @ApiProperty({
    description: 'id author comment',
  })
  author?: string;

  @IsMongoId()
  @ApiProperty({
    description: 'id comment',
  })
  comment?: string;

  @IsString()
  @ApiProperty({
    description: 'content report',
  })
  content?: string;
}
