import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateFileMongoDBDto } from 'src/base/create-dto';

export class CreateSingerDto extends CreateFileMongoDBDto {
  @IsString()
  @ApiProperty({
    example: 'Singer',
    description: 'name Singer in system',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'avatar',
  })
  avatar?: string;
}
