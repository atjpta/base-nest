import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class QueryFindAll {
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 1,
    description: `page of documents`,
  })
  page?: number = 1;

  @Type(() => Number)
  @Min(1)
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 10,
    description: `limit of documents`,
  })
  limit?: number = Infinity;
}
