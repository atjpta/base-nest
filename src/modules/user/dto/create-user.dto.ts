import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    example: 'user',
    description: 'role of user',
  })
  role: string;

  @IsString()
  @ApiProperty({
    example: 'user2',
    description: 'username of user',
  })
  username: string;

  @IsEmail()
  @IsString()
  @ApiProperty({
    example: 'user2@gmail.com',
    description: 'email of user',
  })
  email: string;

  @IsString()
  @ApiProperty({
    example: 'user2',
    description: 'password of user',
  })
  password: string;
}
