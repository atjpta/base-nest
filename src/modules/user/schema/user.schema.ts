import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { BaseMongoDbSchema } from 'src/base/mongodb';
import { PermissionConstant } from 'src/modules/permission/constant/permission.constant';
import { PermissionModel } from 'src/modules/permission/schema/permission.schema';
import { RoleConstant } from 'src/modules/role/constant/role.constant';
import { RoleModel } from 'src/modules/role/schema/role.schema';

@Schema()
export class UserModel extends BaseMongoDbSchema {
  @Prop({
    type: Types.ObjectId,
    ref: RoleConstant.MODEL_NAME,
  })
  role: RoleModel;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: PermissionConstant.MODEL_NAME,
    },
  ])
  permissions: PermissionModel[];

  @Prop({
    type: String,
    unique: true,
  })
  username: string;

  @Prop({
    type: String,
  })
  avatar: string;

  @Prop({
    type: String,
    index: 'text',
  })
  fullName: string;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    required: false,
    type: Boolean,
    default: false,
  })
  isOnline?: boolean;

  @Prop({
    required: false,
    type: String,
    default: () => new Date().toISOString(),
  })
  lastTimeOnline?: string;
}
