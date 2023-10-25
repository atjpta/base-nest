import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportModel } from './schema/report.schema';
import { ReportConstant } from './constant/report.constant';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ReportConstant.MODEL_NAME,
        schema: SchemaFactory.createForClass(ReportModel),
      },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
