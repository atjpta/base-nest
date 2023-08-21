/* eslint-disable @typescript-eslint/no-var-requires */
import { GridFsStorage } from 'multer-gridfs-storage';
import { AppConfig } from 'src/configs/app.config';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { SongConstant } from '../constant/song.constant';
const multer = require('multer');

@Injectable()
export class uploadOneSongMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const Song = multer({
      storage: new GridFsStorage({
        url: AppConfig.getInstance().database.uri,
        file: (req, file) => {
          return new Promise((resolve) => {
            const filename = file.originalname;
            const fileInfo = {
              filename: filename,
              bucketName: SongConstant.BUCKETS,
            };
            resolve(fileInfo);
          });
        },
      }),
    });
    Song.single('file')(req, res, () => {
      next();
    });
  }
}

export class uploadArraySongMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const Song = multer({
      storage: new GridFsStorage({
        url: AppConfig.getInstance().database.uri,
        file: (req, file) => {
          return new Promise((resolve) => {
            const filename = file.originalname;
            const fileInfo = {
              filename: filename,
              bucketName: SongConstant.BUCKETS,
            };
            resolve(fileInfo);
          });
        },
      }),
    });
    Song.array('file')(req, res, () => {
      next();
    });
  }
}
