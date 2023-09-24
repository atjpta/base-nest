import { SingerConstant } from './../../singer/constant/singer.constant';
import { AppConstant } from 'src/modules/app/constant/app.constant';
import { CountryConstant } from 'src/modules/country/constant/country.constant';
import { FileConstant } from 'src/modules/file/constant/file.constant';
import { GenreConstant } from 'src/modules/genre/constant/genre.constant';
import { ImageConstant } from 'src/modules/image/constant/image.constant';
import { MusicConstant } from 'src/modules/music/constant/music.constant';
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
    SingerConstant.MODEL_NAME,
    GenreConstant.MODEL_NAME,
    CountryConstant.MODEL_NAME,
    MusicConstant.MODEL_NAME,
  ];
}
