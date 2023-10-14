import { AppConstant } from 'src/modules/app/constant/app.constant';
import { CommentConstant } from 'src/modules/comment/constant/comment.constant';
import { MusicConstant } from 'src/modules/music/constant/music.constant';
import { PlaylistConstant } from 'src/modules/playlist/constant/playlist.constant';
import { SingerConstant } from 'src/modules/singer/constant/singer.constant';

export class FavoriteConstant {
  static SWAGGER_TAG = `favorite`;
  static API_PREFIX = AppConstant.APP_PREFIX + `/favorites`;
  static MODEL_NAME = `favorites`;
  static SCHEMA_MODEL_TYPE = [
    MusicConstant.MODEL_NAME,
    PlaylistConstant.MODEL_NAME,
    SingerConstant.MODEL_NAME,
    CommentConstant.MODEL_NAME,
  ];
}
