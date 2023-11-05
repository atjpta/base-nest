import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStatusCommentDto } from './create-status-comment.dto';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class UpdateStatusCommentDto extends PartialType(
  CreateStatusCommentDto,
) {
  @Type(() => Number)
  @Min(2)
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 1,
    description: 'number day is banned',
  })
  times?: number;
}
