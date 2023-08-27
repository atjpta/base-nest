import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailConstant } from './constant/mail.constant';
import { MailService } from './mail.service';
import { BaseHttpStatus } from 'src/base/http-status';
import { IHttpSuccess, BaseResponse } from 'src/base/response';
import { createMailDto } from './dto/create-mail.dto';

@ApiBearerAuth()
@ApiTags(MailConstant.SWAGGER_TAG)
@Controller({ path: MailConstant.API_PREFIX })
export class MailController {
  constructor(private readonly _modelService: MailService) {}

  // ========== API POST ==========

  @Post()
  @ApiOperation({
    summary: `--- Create ${MailConstant.SWAGGER_TAG} ---`,
  })
  public async create(
    @Body() body: createMailDto,
  ): Promise<IHttpSuccess | HttpException> {
    await this._modelService.welCome(body.mail, body.name);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: MailConstant.SWAGGER_TAG,
      data: true,
    });
  }

  // ========== API GET ==========

  // ========== API PUT ==========

  // ========== API DELETE ==========
}
