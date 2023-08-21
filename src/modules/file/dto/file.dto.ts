import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    description: 'Chose file for upload',
    format: 'binary',
  })
  file: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'enter name',
  })
  customName: string;
}

export class CreateMultipleFileDto {
  @ApiProperty({
    description: 'Chose multiple file for upload',
    format: 'binary',
  })
  file: Array<any>;
}

export class UpdateFileDto extends PickType(CreateFileDto, ['customName']) {}
