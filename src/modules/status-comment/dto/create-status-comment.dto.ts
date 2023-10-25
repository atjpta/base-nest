import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';

export class CreateStatusCommentDto {
  @IsMongoId()
  @ApiProperty({
    description: 'id user',
  })
  user?: string;

  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    example: 1,
    description: 'number day is banned',
  })
  day?: number;

  @IsOptional()
  @Type(() => Boolean)
  @ApiProperty({
    required: false,
    example: false,
    description: 'number day is banned',
  })
  isBanned?: boolean;
}
