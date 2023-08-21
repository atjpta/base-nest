import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { RoleConstant } from './constant/role.constant';
import { RoleModel } from './schema/role.schema';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RoleConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(RoleModel),
      },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
