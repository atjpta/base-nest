import { AppConstant } from 'src/modules/app/constant/app.constant';

export class NotificationConstant {
  static SWAGGER_TAG = `notifications`;
  static API_PREFIX = AppConstant.APP_PREFIX + `/notifications`;
  static MODEL_NAME = `notifications`;

  static TypeNotification = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
  };
}
