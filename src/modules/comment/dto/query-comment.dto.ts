import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { QueryFindAll } from 'src/base/query-dto';

export class QuerySearchCommentDto extends QueryFindAll {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'aa',
    description: 'key search',
  })
  key?: string;
}
