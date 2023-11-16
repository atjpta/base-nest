import { AppConstant } from 'src/modules/app/constant/app.constant';
import { CountryConstant } from 'src/modules/country/constant/country.constant';
import { GenreConstant } from 'src/modules/genre/constant/genre.constant';
import { MusicConstant } from 'src/modules/music/constant/music.constant';
import { NewsConstant } from 'src/modules/news/constant/news.constant';
import { ReportConstant } from 'src/modules/report/constant/report.constant';
import { SingerConstant } from 'src/modules/singer/constant/singer.constant';
import { UserConstant } from 'src/modules/user/constant/user.constant';

export class PermissionConstant {
  static SWAGGER_TAG = `permissions`;
  static API_PREFIX = AppConstant.APP_PREFIX + `/permissions`;
  static MODEL_NAME = `permissions`;

  static LIST_PERMISSION = [
    UserConstant.MODEL_NAME,
    SingerConstant.MODEL_NAME,
    GenreConstant.MODEL_NAME,
    CountryConstant.MODEL_NAME,
    MusicConstant.MODEL_NAME,
    NewsConstant.MODEL_NAME,
    ReportConstant.MODEL_NAME,
  ];
}
