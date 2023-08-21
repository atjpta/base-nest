/* eslint-disable @typescript-eslint/no-var-requires */
import { GridFsStorage } from 'multer-gridfs-storage';
import { AppConfig } from 'src/configs/app.config';
import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ImageConstant } from '../constant/image.constant';
const multer = require('multer');
@Injectable()
export class uploadOneImageMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const image = multer({
      storage: new GridFsStorage({
        url: AppConfig.getInstance().database.uri,
        file: async (req, file) => {
          return new Promise(async (resolve) => {
            const filename = file.originalname;
            const fileInfo = {
              filename: filename,
              bucketName: ImageConstant.BUCKETS,
            };
            resolve(fileInfo);
          });
        },
      }),
    });
    image.single('file')(req, res, () => {
      next();
    });
  }
}

@Injectable()
export class uploadArrayImageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const Image = multer({
      storage: new GridFsStorage({
        url: AppConfig.getInstance().database.uri,
        file: async (req, file) => {
          return new Promise(async (resolve) => {
            const filename = file.originalname;
            const fileInfo = {
              filename: filename,
              bucketName: ImageConstant.BUCKETS,
            };
            resolve(fileInfo);
          });
        },
      }),
    });
    Image.array('file')(req, res, () => {
      next();
    });
  }
}
