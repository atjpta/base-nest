import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { UserConstant } from './constant/user.constant';
import { UserModel } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([
      {
        name: UserConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(UserModel),
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, RoleModule],
})
export class UserModule {}
