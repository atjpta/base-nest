import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MongoosePlugin } from './plugins/mongoose.plugin';
import { AppConfig } from '../../configs/app.config';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
import { ImageModule } from '../image/image.module';
import { SongModule } from '../song/song.module';

@Module({
  imports: [
    FileModule,
    UserModule,
    ImageModule,
    SongModule,
    MongooseModule.forRootAsync({
      imports: [],
      useFactory: async () => {
        const uri = AppConfig.getInstance().database.uri;
        console.log(`Connected to database!`);
        return {
          connectionFactory: (connection: any) => {
            connection.plugin(MongoosePlugin.removeVersionFieldPlugin);
            return connection;
          },
          uri: uri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [],
    }),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  constructor(readonly _databaseService: DatabaseService) {
    this._databaseService.initDataBase();
  }
}
