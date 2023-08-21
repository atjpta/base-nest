import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({
    example: 'root',
    description: 'The username of the user',
  })
  username: string;

  @IsString()
  // @IsStrongPassword({})
  @ApiProperty({
    example: 'root',
    description: 'The password of the user',
  })
  password: string;
}
