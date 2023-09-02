import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
export class CreateFileMongoDBDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Chose file for upload',
    format: 'binary',
  })
  file: string;
}

export class CreateFilesArrayMongoDBDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Chose file for upload',
    format: 'binary',
  })
  file: [];
}
