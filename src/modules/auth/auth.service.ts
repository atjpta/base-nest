import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthConfig, AppConfig } from 'src/configs/app.config';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { UserModel } from '../user/schema/user.schema';

@Injectable()
export class AuthService {
  private _authKey: IAuthConfig;
  constructor(
    private readonly _userService: UserService,
    private readonly _roleService: RoleService,
    private readonly _jwtService: JwtService,
  ) {
    this._authKey = AppConfig.getInstance().auth;
  }

  private async _generateTokenJWT(
    userId: string,
    role: string,
  ): Promise<string> {
    const payload = { userId, role };
    const token = this._jwtService.sign(payload, {
      secret: this._authKey.accessTokenSecretKey,
      expiresIn: `${this._authKey.accessTokenExpirationTime}s`,
    });
    return token;
  }

  private async _generateRefreshTokenJWT(
    userId: string,
    role: string,
  ): Promise<string> {
    const payload = { userId, role };
    const token = this._jwtService.sign(payload, {
      secret: this._authKey.refreshTokenSecretKey,
      expiresIn: `${this._authKey.refreshTokenExpirationTime}s`,
    });
    return token;
  }

  public async decodeTokenJWT(token: string): Promise<any> {
    const result = this._jwtService.verify(token);
    return result;
  }

  public async register(user: RegisterDto): Promise<UserModel> {
    const role = await this._roleService.findOneByField({
      name: 'user',
    });

    const result = await this._userService.createUser({
      ...user,
      role: role._id,
    });
    return result;
  }

  public async login(user: UserModel) {
    const accessToken = await this._generateTokenJWT(user._id, user.role.name);
    const refreshToken = await this._generateRefreshTokenJWT(
      user._id,
      user.role._id,
    );
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatar: user.avatar,
      role: user.role.name,
      accessToken: accessToken,
      refreshToken: refreshToken,
      permissions: user.permissions,
    };
  }
}
