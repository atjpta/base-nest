/* eslint-disable @typescript-eslint/no-var-requires */
import { GridFsStorage } from 'multer-gridfs-storage';
import { AppConfig } from 'src/configs/app.config';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { SongConstant } from 'src/modules/song/constant/song.constant';
import { ImageConstant } from 'src/modules/image/constant/image.constant';
const multer = require('multer');
@Injectable()
export class uploadMusicMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const file = multer({
      storage: new GridFsStorage({
        url: AppConfig.getInstance().database.uri,
        file: (req, file) => {
          return new Promise((resolve) => {
            const filename = file.originalname;
            const typeFile = file.mimetype.split('/')[0];

            const fileInfo = {
              filename: filename,
              bucketName: SongConstant.BUCKETS,
            };

            if (typeFile == 'image') {
              fileInfo.bucketName = ImageConstant.BUCKETS;
            }

            resolve(fileInfo);
          });
        },
      }),
    });
    file.array('file')(req, res, () => {
      next();
    });
  }
}
