import { ReportConstant } from './../../report/constant/report.constant';
import { CommentConstant } from 'src/modules/comment/constant/comment.constant';
import { SingerConstant } from './../../singer/constant/singer.constant';
import { AppConstant } from 'src/modules/app/constant/app.constant';
import { CountryConstant } from 'src/modules/country/constant/country.constant';
import { FavoriteConstant } from 'src/modules/favorite/constant/favorite.constant';
import { FileConstant } from 'src/modules/file/constant/file.constant';
import { GenreConstant } from 'src/modules/genre/constant/genre.constant';
import { ImageConstant } from 'src/modules/image/constant/image.constant';
import { MusicConstant } from 'src/modules/music/constant/music.constant';
import { RoleConstant } from 'src/modules/role/constant/role.constant';
import { SongConstant } from 'src/modules/song/constant/song.constant';
import { UserConstant } from 'src/modules/user/constant/user.constant';
import { PlaylistConstant } from 'src/modules/playlist/constant/playlist.constant';
import { NewsConstant } from 'src/modules/news/constant/news.constant';
import { StatusCommentConstant } from 'src/modules/status-comment/constant/status-comment.constant';
import { NotificationConstant } from 'src/modules/notification/constant/notification.constant';

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
    FavoriteConstant.MODEL_NAME,
    CommentConstant.MODEL_NAME,
    PlaylistConstant.MODEL_NAME,
    NewsConstant.MODEL_NAME,
    ReportConstant.MODEL_NAME,
    StatusCommentConstant.MODEL_NAME,
    NotificationConstant.MODEL_NAME,
  ];
}
