import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateFileMongoDBDto } from 'src/base/create-dto';

export class CreateCountryDto extends CreateFileMongoDBDto {
  @IsString()
  @ApiProperty({
    example: 'Country',
    description: 'name Country in system',
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
