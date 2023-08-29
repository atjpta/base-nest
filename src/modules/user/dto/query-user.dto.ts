import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class QueryForgetAccount {
  @IsString()
  @ApiProperty({
    example: 'aa',
    description: 'username account',
  })
  username: string;

  @IsEmail()
  @ApiProperty({
    example: 'caoducan351@gmail.com',
    description: 'email account',
  })
  email: string;
}
