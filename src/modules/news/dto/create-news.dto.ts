import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateFileMongoDBDto } from 'src/base/create-dto';

export class CreateNewsDto extends CreateFileMongoDBDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'image',
  })
  image?: string;
}
