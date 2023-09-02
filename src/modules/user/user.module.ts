import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { UserConstant } from './constant/user.constant';
import { UserModel } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from '../role/role.module';
import { BullModule } from '@nestjs/bull';
import { BullConstant } from '../bull/constant/bull.constant';
import { uploadOneImageMiddleware } from '../image/middleware/image.middleware';

@Module({
  imports: [
    RoleModule,
    MongooseModule.forFeature([
      {
        name: UserConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(UserModel),
      },
    ]),
    BullModule.registerQueue({
      name: BullConstant.JOB_BULL.sendEmail,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, BullModule],
  exports: [UserService, RoleModule],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(uploadOneImageMiddleware).forRoutes({
      path: `${UserConstant.API_PREFIX}`,
      method: RequestMethod.PUT,
    });
  }
}
