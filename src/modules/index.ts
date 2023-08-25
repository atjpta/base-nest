import { BaseHttpExceptionFilter } from 'src/base/http-exception-filter';
import { MongoExceptionFilter } from 'src/base/mongodb-exception-filter';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { DatabaseModule } from './database/database.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { ImageModule } from './image/image.module';
import { SongModule } from './song/song.module';
import { CacheRedisModule } from './cache-redis/cache-redis.module';
import { MailModule } from './mail/mail.module';

export const APP_MODULES = [
  DatabaseModule,
  MailModule,
  CacheRedisModule,
  UserModule,
  RoleModule,
  AuthModule,
  FileModule,
  ImageModule,
  SongModule,
  // SocketManagerModule,
];

export const APP_FILTERS = [BaseHttpExceptionFilter, MongoExceptionFilter];
export const APP_GUARDS = [JwtAuthGuard, RolesGuard];
