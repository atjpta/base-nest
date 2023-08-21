import { CreateRoleDto } from './dto/create-role.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { RoleConstant } from './constant/role.constant';
import { RoleModel } from './schema/role.schema';

@Injectable()
export class RoleService extends BaseApiService<RoleModel> {
  constructor(
    @InjectModel(RoleConstant.MODEL_NAME)
    readonly _model: Model<RoleModel>,
  ) {
    super(_model);
  }
  public async initCollection(): Promise<RoleModel[]> {
    const records: RoleModel[] = [];
    const documentCount = await this._model.estimatedDocumentCount();
    if (documentCount === 0) {
      for (const item of Object.values(RoleConstant.LIST_ROLES)) {
        const newDocument: CreateRoleDto = {
          name: item,
        };
        records.push(await this.create(newDocument));
      }
      console.log(
        `--> initial ${RoleConstant.MODEL_NAME} collection completed!`,
      );
    }
    return records;
  }
}
