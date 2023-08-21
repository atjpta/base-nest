import { ApiProperty } from '@nestjs/swagger';
export class CreateFileMongoDBDto {
  @ApiProperty({
    description: 'Chose file for upload',
    format: 'binary',
  })
  file: string;
}

export class CreateFilesArrayMongoDBDto {
  @ApiProperty({
    description: 'Chose file for upload',
    format: 'binary',
  })
  file: [];
}
