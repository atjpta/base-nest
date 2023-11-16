import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { GridFSBucket, GridFSFile, GridFSBucketReadStream } from 'mongodb';
import { SongConstant } from './constant/song.constant';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MusicService } from '../music/music.service';
@Injectable()
export class SongService {
  private bucket: GridFSBucket;
  private listView: Set<string>;
  constructor(
    @InjectConnection() private connection: Connection,
    readonly _musicService: MusicService,
  ) {
    this.bucket = new GridFSBucket(this.connection.db, {
      bucketName: SongConstant.BUCKETS,
    });
    this.listView = new Set<string>();
  }

  public async downloadFileByName(
    filename: string,
  ): Promise<GridFSBucketReadStream> {
    return this.bucket.openDownloadStreamByName(filename);
  }

  public async findOneInfoFile(filename: string): Promise<GridFSFile> {
    const records = await this.bucket.find({ filename: filename }).toArray();
    return records[0];
  }

  public async findAllInfoFile(
    page: number,
    limit: number,
  ): Promise<GridFSFile[]> {
    const skipIndex = (page - 1) * limit;

    const records = await this.bucket
      .find()
      .sort('-uploadDate')
      .limit(limit)
      .skip(skipIndex)
      .toArray();

    return records;
  }
  public async DeleteOne(filename: string): Promise<any> {
    const file = await this.findOneInfoFile(filename);
    await this.bucket.delete(file._id);
    return file;
  }

  public async DeleteAll(): Promise<number> {
    const records = await this.bucket.find().toArray();
    await this.bucket.drop();
    return records.length;
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async deleteDuplicate() {
    const duplicateImages = await this.bucket.find({}).toArray();

    const seenFilenames = new Set();
    const duplicateFileIdsToDelete: mongoose.Types.ObjectId[] = [];

    for (const image of duplicateImages) {
      if (seenFilenames.has(image.filename)) {
        duplicateFileIdsToDelete.push(image._id);
      } else {
        seenFilenames.add(image.filename);
      }
    }

    if (duplicateFileIdsToDelete.length > 0) {
      for (const fileId of duplicateFileIdsToDelete) {
        await this.bucket.delete(fileId);
      }
      return duplicateFileIdsToDelete;
    } else {
      return;
    }
  }

  public async updateView(filename: string, ip: string) {
    const key = filename + '----' + ip;
    if (this.listView.has(key)) {
      return;
    } else {
      this.listView.add(key);
      const music = await this._musicService.findByFilename(filename);
      await this._musicService.updateView(music._id);
      setTimeout(
        () => {
          this.listView.delete(key);
        },
        2 * 60 * 1000,
      );
    }
    return;
  }
}
