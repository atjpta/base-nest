import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateViewDetailDto {
  @IsMongoId()
  @ApiProperty({
    description: 'id music',
  })
  music?: string;
}
