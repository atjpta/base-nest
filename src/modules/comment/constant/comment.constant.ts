import { AppConstant } from 'src/modules/app/constant/app.constant';
import { MusicConstant } from 'src/modules/music/constant/music.constant';

export class CommentConstant {
  static SWAGGER_TAG = `comment`;
  static API_PREFIX = AppConstant.APP_PREFIX + `/comments`;
  static MODEL_NAME = `comments`;
  static SCHEMA_MODEL_TYPE = [
    MusicConstant.MODEL_NAME,
    CommentConstant.MODEL_NAME,
  ];
}
