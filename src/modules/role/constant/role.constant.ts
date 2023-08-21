import { AppConstant } from 'src/modules/app/constant/app.constant';

export class RoleConstant {
  static SWAGGER_TAG = `role`;
  static API_PREFIX = AppConstant.APP_PREFIX + `/roles`;
  static MODEL_NAME = `roles`;

  static LIST_ROLES = {
    Root: 'root',
    Admin: 'admin',
    User: 'user',
  };
}
