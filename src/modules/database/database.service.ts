import { RoleService } from './../role/role.service';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { RoleConstant } from '../role/constant/role.constant';
import { DatabasesConstant } from './constant/database.constant';
import { Collection, DeleteResult } from 'mongodb';
import { ResDelete } from './interfaces/database.interface';
import { UserService } from '../user/user.service';
import { UserConstant } from '../user/constant/user.constant';
import { FileService } from '../file/file.service';
import { FileConstant } from '../file/constant/file.constant';
import { ImageService } from '../image/image.service';
import { SongService } from '../song/song.service';
import { ImageConstant } from '../image/constant/image.constant';
import { SongConstant } from '../song/constant/song.constant';
import { PermissionService } from '../permission/permission.service';
import { PermissionConstant } from '../permission/constant/permission.constant';
@Injectable()
export class DatabaseService {
  constructor(
    @InjectConnection() private connection: Connection,
    readonly roleService: RoleService,
    readonly userService: UserService,
    readonly fileService: FileService,
    readonly imageService: ImageService,
    readonly songService: SongService,
    readonly permissionService: PermissionService,
  ) {}

  public async dropDatabase(): Promise<ResDelete[]> {
    const resData: ResDelete[] = [];
    for (const collectionName of DatabasesConstant.COLLECTIONS_NAME) {
      switch (collectionName) {
        // case FileConstant.FOLDER:
        //   const countFile = await this.fileService.deleteAll();
        //   resData.push({
        //     collectionName: FileConstant.FOLDER,
        //     deletedCount: countFile,
        //   });
        //   break;

        case ImageConstant.BUCKETS:
          const countImage = await this.imageService.DeleteAll();
          resData.push({
            collectionName: ImageConstant.BUCKETS,
            deletedCount: countImage,
          });
          break;

        case SongConstant.BUCKETS:
          const countSong = await this.songService.DeleteAll();
          resData.push({
            collectionName: ImageConstant.BUCKETS,
            deletedCount: countSong,
          });
          break;

        default:
          const collection: Collection =
            this.connection.collection(collectionName);
          const deleteResult: DeleteResult = await collection.deleteMany({});
          resData.push({
            collectionName: collectionName,
            deletedCount: deleteResult.deletedCount,
          });
          break;
      }
    }
    return resData;
  }
  public async dropCollection(collectionName: string): Promise<ResDelete> {
    switch (collectionName) {
      // case FileConstant.FOLDER:
      //   const countFile = await this.fileService.deleteAll();
      //   return {
      //     collectionName: FileConstant.FOLDER,
      //     deletedCount: countFile,
      //   };

      case ImageConstant.BUCKETS:
        const countImage = await this.imageService.DeleteAll();
        return {
          collectionName: ImageConstant.BUCKETS,
          deletedCount: countImage,
        };

      case SongConstant.BUCKETS:
        const countSong = await this.songService.DeleteAll();
        return {
          collectionName: SongConstant.BUCKETS,
          deletedCount: countSong,
        };

      default:
        const resData = await this.connection
          .collection(collectionName)
          .deleteMany({});
        return {
          collectionName: collectionName,
          deletedCount: resData.deletedCount,
        };
    }
  }
  public async getCollections(): Promise<string[]> {
    const collections = await this.connection.db.listCollections().toArray();

    return collections.map((collection) => collection.name);
  }

  public async initDataBase(): Promise<any> {
    const db = {
      [FileConstant.FOLDER]: await this.fileService.initFolderUpload(),
      [RoleConstant.MODEL_NAME]: await this.roleService.initCollection(),
      [UserConstant.MODEL_NAME]: await this.userService.initCollection(),
      [UserConstant.MODEL_NAME]: await this.userService.initCollection(),
      [PermissionConstant.MODEL_NAME]:
        await this.permissionService.initCollection(),
    };
    return db;
  }
}
