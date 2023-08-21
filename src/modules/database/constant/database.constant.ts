import { AppConstant } from 'src/modules/app/constant/app.constant';
import { FileConstant } from 'src/modules/file/constant/file.constant';
import { ImageConstant } from 'src/modules/image/constant/image.constant';
import { RoleConstant } from 'src/modules/role/constant/role.constant';
import { SongConstant } from 'src/modules/song/constant/song.constant';
import { UserConstant } from 'src/modules/user/constant/user.constant';

export class DatabasesConstant {
  static SWAGGER_TAG = `database`;
  static API_PREFIX = AppConstant.APP_PREFIX + `/databases`;

  static COLLECTIONS_NAME = [
    RoleConstant.MODEL_NAME,
    UserConstant.MODEL_NAME,
    FileConstant.FOLDER,
    ImageConstant.BUCKETS,
    SongConstant.BUCKETS,
  ];
}
