import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateFileMongoDBDto } from 'src/base/create-dto';

export class CreateArtistDto extends CreateFileMongoDBDto {
  @IsString()
  @ApiProperty({
    example: 'Artist',
    description: 'name Artist in system',
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
