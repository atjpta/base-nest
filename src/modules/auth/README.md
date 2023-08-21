# Xử lý phân quyền bằng jwt

## Luồng xử lý

- Request sẽ trải qua các guard:
  - `Auth Guard`:
    - server lấy token trong trường `authorization` trong request header
    - giải mã, tìm ra id và username trong token
    - tìm kiếm user trong db với id, sau đó so sánh username đã giải mã và username trong database
    - [Ok]: gán vào request trường user {id, username, role}
    - [NotFit]: return Exception()
  - `Role Guard`:
    - server lấy trường `user` vừa được gán sau khi xử lý ở `Auth Guard`
    - so sánh với các phần tử trong mảng `@hasRoles(...)`
    - [Ok]: Có một phân tử phù hợp thì được truy cập sử dụng service
    - [NotFit]: return Exception()

## Sử dụng ở controller

- Mặc định của ứng dụng là mọi API đề phải có token jwt mới có thể truy cập được
- nếu muốn viết API k cần token thì phải khai báo `@IsPublic()` vào trước route

  ```ts
  @IsPublic()// khai báo thêm ở đây
  @Post()
  @ApiOperation({ summary: `--- Create TestAuth in system ---` })
  public async create(
    @Body() body: CreateTestAuthDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: TestAuthConstant.MODEL_NAME,
      data: records,
    });
  }
  ```

- chúng ta cũng có thể khai báo `@IsPublic()` cho toàn bộ contreller khi để ở trên `class_controller`

  ```ts
  @IsPublic() // khai báo thêm ở đây
  @ApiTags(AuthConstant.SWAGGER_TAG)
  @Controller({ path: AuthConstant.API_PREFIX })
  export class AuthController {
  constructor(
    private readonly _modelService: AuthService,
    private readonly _userService: UserService,
  ) {}
  ```

- cần phải khai báo `@ApiBearerAuth()` trước `class_controller` để có thể cho swagger biết đang xài `JWT`

  ```ts
  @ApiBearerAuth() // khai báo thêm ở đây
  @ApiTags(TestAuthConstant.SWAGGER_TAG)
  @Controller({ path: TestAuthConstant.API_PREFIX })
  export class TestAuthController {
    constructor(private readonly _modelService: TestAuthService) {}

  ```

- Thêm các quyền vào `@hasRoles(...)` để xác định quyền truy cập, mặc định là phải cần quyền user. Ngoài ra người dùng `Root` có toàn quyền trong hệ thống, có thể truy cập mọi thứ (username: root, password : root)

  ```ts
  @HasRoles(RoleConstant.LIST_ROLES.Admin, RoleConstant.LIST_ROLES.Root) // khai báo thêm ở đây, cần quyền admin or là root để có thể truy cập được
  @Get()
  @ApiOperation({ summary: `--- find all TestAuth in system ---` })
  public async findAll(
    @GetUser() user: IUser,
    @Query()
    query: QueryFindAll,
  ): Promise<IHttpSuccess | HttpException> {
    console.log(user);
    const records = await this._modelService.findAll(query.page, query.limit);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: TestAuthConstant.MODEL_NAME,
      data: records,
    });
  }
  ```

- khi có token, mặc định hệ thống sẽ biết request từ `user` là ai, dùng 1 số decorator trong `user.decorator.ts` để lấy thông tin `user`, thông tin user gồm có id và role

  ```ts
    @Get()
    @ApiOperation({ summary: `--- get info user from JWT ---` })
    public async testGetUserAuth(
      @GetUser() user: IUser, // lấy thông tin user
      @GetUserId() userId: string, // lấy id user
      @GetUserRole() userRole: string, // lấy role user
    ): Promise<any> {
      return { user, userId, userRole };
    }
  ```

## Lưu ý: phải thêm `token` vào trường `authorization` trong header của request để truy cập vào các API
