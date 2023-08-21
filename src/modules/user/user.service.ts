import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { UserConstant } from './constant/user.constant';
import { UserModel } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { AppConfig } from 'src/configs/app.config';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleConstant } from '../role/constant/role.constant';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService extends BaseApiService<UserModel> {
  constructor(
    @InjectModel(UserConstant.MODEL_NAME)
    readonly _model: Model<UserModel>,
    readonly _roleService: RoleService,
  ) {
    super(_model);
  }

  private _generateHashPassword(password: string): string {
    const hash = bcrypt.hashSync(
      password,
      AppConfig.getInstance().auth.saltRound,
    );
    return hash;
  }

  public async createUser(user: CreateUserDto): Promise<UserModel> {
    const password = this._generateHashPassword(user.password);
    user.password = password;
    return (await this._model.create(user)).populate('role', 'name');
  }

  public async findByUserName(username: string): Promise<UserModel> {
    return await this._model
      .findOne({ username: username })
      .populate('role', 'name');
  }

  public async initCollection(): Promise<UserModel[]> {
    const records: UserModel[] = [];
    const documentCount = await this._model.estimatedDocumentCount();
    if (documentCount === 0) {
      for (const item of Object.values(RoleConstant.LIST_ROLES)) {
        const role = await this._roleService.findOneByField({ name: item });
        const newDocument: CreateUserDto = {
          email: item + '@gmail.com',
          password: item,
          role: role._id,
          username: item,
        };
        records.push(await this.createUser(newDocument));
      }
      console.log(
        `--> initial ${UserConstant.MODEL_NAME} collection completed!`,
      );
    }
    return records;
  }
  public async updatePassword(
    id: string,
    password: string,
  ): Promise<UserModel> {
    const newPassword = this._generateHashPassword(password);
    const user = await this._model.findByIdAndUpdate(
      id,
      { password: newPassword },
      { new: true },
    );
    return user;
  }

  public async comparePasswords(
    newPassword: string,
    hashPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(newPassword, hashPassword);
    return isMatch;
  }
}