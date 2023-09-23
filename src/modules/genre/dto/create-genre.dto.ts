import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateFileMongoDBDto } from 'src/base/create-dto';

export class CreateGenreDto extends CreateFileMongoDBDto {
  @IsString()
  @ApiProperty({
    example: 'Genre',
    description: 'name Genre in system',
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
