import { ConfigService } from '@nestjs/config';

export interface IAuthConfig {
  accessTokenSecretKey: string;
  refreshTokenSecretKey: string;
  accessTokenExpirationTime: number;
  refreshTokenExpirationTime: number;
  saltRound: number;
}

export interface IRedis {
  host: string;
  port: number;
  ttl: number;
  db: number;
  password: string;
}

export interface IDatabaseConfig {
  uri: string;
}

export interface ISupabaseConfig {
  uri: string;
  apiKey: string;
}

export interface IAuthAppOther {
  id: string;
  secret: string;
}

export interface IAppConfig {
  port: number;
  apiVersion: number;
  product: string;
}

export interface IMailConfig {
  host: string;
  user: string;
  password: string;
  from: string;
}

export class AppConfig {
  private static configService: ConfigService;
  private static instance: AppConfig;
  public static urlServer: string;
  private constructor() {
    //..
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
      AppConfig.configService = new ConfigService();
    }

    return AppConfig.instance;
  }

  get app(): IAppConfig {
    const result = {
      port: Number.parseInt(
        AppConfig.configService.get<string>('APP_PORT') ?? '3600',
      ),
      apiVersion: Number.parseInt(
        AppConfig.configService.get<string>('APP_API_VERSION') ?? '1',
      ),
      product: AppConfig.configService.get<string>('PRODUCT') ?? 'dev',
    };
    return result;
  }

  get auth(): IAuthConfig {
    return {
      accessTokenSecretKey:
        AppConfig.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') ?? '',
      refreshTokenSecretKey:
        AppConfig.configService.get<string>('REFRESH_ACCESS_TOKEN_SECRET') ??
        '',
      accessTokenExpirationTime: Number.parseInt(
        AppConfig.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        ) ?? '60',
      ),
      refreshTokenExpirationTime: Number.parseInt(
        AppConfig.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        ) ?? '60',
      ),
      saltRound: Number.parseInt(
        AppConfig.configService.get<string>('SALT_ROUND') ?? '1',
      ),
    };
  }
  get database(): IDatabaseConfig {
    return {
      uri:
        AppConfig.configService.get<string>('DATABASE_URI') ??
        'mongodb+srv://admin:abc201199@cluster0.3crqh.mongodb.net/nestBase?retryWrites=true&w=majority',
    };
  }

  get authFacebook(): IAuthAppOther {
    return {
      id: AppConfig.configService.get<string>('FACEBOOK_APP_ID'),
      secret: AppConfig.configService.get<string>('FACEBOOK_APP_SECRET'),
    };
  }

  get authGoogle(): IAuthAppOther {
    return {
      id: AppConfig.configService.get<string>('GOOGLE_APP_ID'),
      secret: AppConfig.configService.get<string>('GOOGLE_APP_SECRET'),
    };
  }

  get supabase(): ISupabaseConfig {
    return {
      uri: AppConfig.configService.get<string>('SUPABASE_PROJECT_URL'),
      apiKey: AppConfig.configService.get<string>('SUPABASE_API_KEY'),
    };
  }

  get redis(): IRedis {
    return {
      host: AppConfig.configService.get<string>('REDIS_HOST') ?? '127.0.0.1',
      port: AppConfig.configService.get<number>('REDIS_PORT') ?? 6379,
      ttl: AppConfig.configService.get<number>('REDIS_TTL') ?? 10,
      db: AppConfig.configService.get<number>('REDIS_DB') ?? 0,
      password: AppConfig.configService.get<string>('REDIS_PASSWORD') ?? '',
    };
  }
  get mail(): IMailConfig {
    return {
      host: AppConfig.configService.get<string>('MAIL_HOST'),
      from: AppConfig.configService.get<string>('MAIL_FROM'),
      password: AppConfig.configService.get<string>('MAIL_PASSWORD'),
      user: AppConfig.configService.get<string>('MAIL_USER'),
    };
  }
}
