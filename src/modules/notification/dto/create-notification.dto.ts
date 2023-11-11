import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { NotificationConstant } from '../constant/notification.constant';

export class CreateNotificationDto {
  @IsMongoId()
  @ApiProperty({
    description: 'id author comment',
  })
  user?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: 'this is content notification',
    description: 'id comment',
  })
  content?: string = '';

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: NotificationConstant.TypeNotification.INFO,
    required: false,
    description: 'content Notification',
  })
  type?: string = NotificationConstant.TypeNotification.INFO;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: false,
    description: 'content Notification',
  })
  isView?: boolean = false;
}
