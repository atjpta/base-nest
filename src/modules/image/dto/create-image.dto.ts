import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateFileMongoDBDto } from 'src/base/create-dto';

export class CreateImageDto extends CreateFileMongoDBDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'name gì đó',
    description: 'name hoi',
  })
  name?: string;
}
