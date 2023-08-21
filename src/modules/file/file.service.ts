import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { FileConstant } from './constant/file.constant';

@Injectable()
export class FileService {
  private _prefixPath = `./${FileConstant.FOLDER}`;

  public async initFolderUpload(): Promise<void> {
    try {
      if (!fs.existsSync(this._prefixPath)) {
        fs.mkdirSync(this._prefixPath, { recursive: true });
        console.log(`--> Initial folder "${this._prefixPath}" completed.`);
      }
    } catch (error) {
      console.error(`Error while initializing folder: ${error}`);
      throw error;
    }
  }

  public async deleteAll(): Promise<number> {
    let count = 0;
    try {
      const files = await fs.promises.readdir(this._prefixPath);
      await Promise.all(
        files.map(async (file) => {
          const filePath = `${this._prefixPath}/${file}`;
          await fs.promises.unlink(filePath);
          count++;
        }),
      );

      return count;
    } catch (error) {
      // Handle errors here if needed
      throw error;
    }
  }

  public async saveFile(
    file: Express.Multer.File,
    path: string,
  ): Promise<void> {
    return await fs.promises.writeFile(path, file.buffer);
  }

  public async haveFile(path: string): Promise<boolean> {
    return fs.existsSync(path);
  }

  public async deleteFile(filename: string): Promise<string> {
    await fs.promises.unlink(`${this._prefixPath}/${filename}`);
    return filename;
  }
}
