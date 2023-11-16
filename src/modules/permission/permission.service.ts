import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseApiService } from 'src/base/api-service';
import { PermissionModel } from './schema/permission.schema';
import { PermissionConstant } from './constant/permission.constant';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService extends BaseApiService<PermissionModel> {
  constructor(
    @InjectModel(PermissionConstant.MODEL_NAME)
    readonly _model: Model<PermissionModel>,
  ) {
    super(_model);
  }

  public async initCollection(): Promise<PermissionModel[]> {
    const records: PermissionModel[] = [];
    const documentCount = await this._model.estimatedDocumentCount();
    if (documentCount === 0) {
      for (const item of Object.values(PermissionConstant.LIST_PERMISSION)) {
        const newDocument: CreatePermissionDto = {
          name: item,
        };
        records.push(await this.create(newDocument));
      }
      console.log(
        `--> initial ${PermissionConstant.MODEL_NAME} collection completed!`,
      );
    }
    return records;
  }
}
