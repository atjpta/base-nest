import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionModel } from './schema/permission.schema';
import { PermissionConstant } from './constant/permission.constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PermissionConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(PermissionModel),
      },
    ]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
