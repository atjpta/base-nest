# Xử lý tải file lên mongodb

## Luồng xử lý

- khi tải `file` lên sẽ dùng form data để tải lên, vì vậy cần chú ý để chỉnh header và body đúng khi gửi và nhận dữ liệu, trong phần body sẽ bắt được file gửi lên.
- Nhưng có diều cần lưu ý là định dạng tên `file` khi truyền trên mạng sẽ bị mã hóa và tên `file` có các kí tự đặc biệt sẽ bị mã hóa và lưu tên `file` vào `mongodb` sẽ khác với tên `file` đã gửi

```ts
@Post('upload')
  @ApiOperation({ summary: `Upload new ${ImageConstant.BUCKETS} to MongoDB` })
  @ApiConsumes('multipart/form-data')
  async uploadFile(@Req() req: Request, @Body() body: CreateFileMongoDBDto): Promise<IHttpSuccess> {
    body;
    console.log(req.files); // info metadata file
    return BaseResponse.success({
      object: ImageConstant.BUCKETS,
      statusCode: BaseHttpStatus.OK,
      data: 1,
    });
  }
```

- về phần lưu `file` sẽ sử dụng thư viện `multer` và `multer-gridfs-storage` để tiến hành lưu `file` vào `mongodb` thông qua `middleware`
- `file` sẽ được lưu vào `mongodb` gồm 2 phần:
  - [bucketName].files : nơi chứa metadate của file
  - [bucketName].chunks : nơi chưa dữ liệu của file đó
- bạn có thể thay đổi để dễ dàng quản lý từng loại file

```ts
export class uploadOneImageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const Image = multer({
      storage: new GridFsStorage({
        cache: true,
        url: AppConfig.getInstance().database.uri,
        file: (req, file) => {
          return new Promise((resolve) => {
            const filename = file.originalname;
            const fileInfo = {
              filename: filename,
              bucketName: ImageConstant.BUCKETS,
            };
            resolve(fileInfo);
          });
        },
      }),
    });
    Image.single('file')(req, res, (err: any) => {
      next(err);
    });
  }
}
```

- sau khi đã tạo `middleware` thì sẽ gắn vào trước `route` để cho nó thực hiện lưu `file`

```ts
export class ImageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(uploadOneImageMiddleware)
      .forRoutes({
        path: '/api/v1/images/upload',
        method: RequestMethod.POST,
      })
      .apply(uploadArrayImageMiddleware)
      .forRoutes({
        path: '/api/v1/images/upload/array',
        method: RequestMethod.POST,
      });
  }
}
```

# Xử lý lấy file từ mongodb

## Luồng xử lý

- khi muốn lấy ảnh từ `mongodb` thì ta phải tạo luồng `stream` từ `mongodb` tới `client`
- sau đây là `service` trả về 1 `stream`

```ts
@Injectable()
export class ImageService {
  private bucket: GridFSBucket;

  constructor(@InjectConnection() private connection: Connection) {
    this.bucket = new GridFSBucket(this.connection.db, {
      bucketName: ImageConstant.BUCKETS,
    });
  }

  public async downloadFileByName(
    filename: string,
  ): Promise<GridFSBucketReadStream> {
    return this.bucket.openDownloadStreamByName(filename);
  }
}
```

- qua bên `controller` thì sẽ bắt đầu trả `stream` về cho `client`

```ts
 @IsPublic()
  @ApiOperation({
    summary: `--- get ${ImageConstant.BUCKETS} in MongoDB ---`,
  })
  @Get(':filename')
  async getFilesInfo(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<IHttpSuccess> {
    const record = await this._modelService.findOneInfoFile(filename);
    if (record[0]) {
      res.setHeader('Content-Type', 'image/jpeg');
      const recordStream = await this._modelService.downloadFileByName(
        filename,
      );
      recordStream.pipe(res);
    }
    return BaseResponse.success({
      object: ImageConstant.BUCKETS,
      statusCode: BaseHttpStatus.NO_FOUND,
    });
  }
```

## lưu ý: tùy thuộc vào loại `file` và mục đích trả về mà set `header` của `response` tương ứng

- có thể xem chi tiết trong 2 module image và song để biết thêm chi tiết
- mặc định, hàm nếu không chạy được sẽ bị bỏ qua và không báo lỗi
