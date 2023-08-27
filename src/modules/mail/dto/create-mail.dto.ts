import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class createMailDto {
  @IsEmail()
  @ApiProperty({
    example: `caoducan351@gmail.com`,
    description: `mail to`,
  })
  mail: string;

  @IsString()
  @ApiProperty({
    example: `cao duc an`,
    description: `name `,
  })
  name: string;
}
