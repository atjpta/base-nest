## `Nghịch Code`

`Nghịch code`: Blog công nghệ dành riêng cho ae dev đam mê viết lách, tìm hiểu công nghệ mới.

- Dự án được khởi đầu bởi những thanh niên đam mê công nghệ, muốn tìm ra con đường của bản thân trong thế giới lập trình đầy khó khăn này.
- Ở đây không có những kỹ thuật phức tạp, mà chỉ tập trung vào những điều cơ bản, hãy coi đây như một cuốn sổ tay note lại những kiến thức, những hướng đi đúng đắn trên con đường lập trình của bạn!
- Với các module nào cần chú ý sẽ có file `readme.md` riêng cho module đó.
- Với source này thì chỉ là base, có sẵn các chức năng cơ bản mà mọi server đều sẽ cần sử dụng, để có thể dễ dàng phát triển, mở rộng ra các project khác, cụ thể hơn.
- hi vọng với source này có thể giúp cho các bạn thực hiện các project lớn hơn và thành công hơn ^^!

- link demo : https://base-nest.vercel.app/

## Công nghệ

- `Backend`: NestJs
- `Database`: MongoDb
- `Frontend`: NuxtJs, Angular

## Hướng dẫn chạy dự án

- Tải các thư viện về máy tính:

```bash
npm i
```

- Chạy dự án

```bash
npm run start:dev or npm run dev
```

## Truy cập Api Document

- Swagger: http://localhost:3000/docs

## Cấu trúc source code

- Dự án gồm 2 nhánh chính:

  - `master`: nhánh code chính, tập trung các chức năng đã ổn định để có thể deploy (có thể dùng fork ra git mới để deloy)
  - `dev`: nhánh thử nghiệm những chức năng mới, chạy được nhưng chưa kiểm thử

- Các bước bắt đầu một feature mới:

  - `checkout dev`: Chuyển sang nhánh dev.
  - `git pull origin dev`: Pull code từ dev về (cập nhập code mới nhất từ dev)
  - `checkout -b [feature-name]`: clone source từ dev sang [feature-name]
  - Coding trên [feature-name]
  - Upload code lên remote.
  - Tạo merge request qua nhánh dev.

- Merge dev vào master: các chức năng cần phải hoạt động oke mới merge sang master

## Các chức năng trong dự án.

- Hệ thống đang có sẵn 3 loại người dùng:

  - người dùng `Root` : có toàn quyền trong hệ thống.
  - người dùng `Admin` : có quyền quản lí các tài nguyên trong hệ thống.
  - người dùng `User` : là người sử dụng hệ thông, chỉ được sử dũng các chức năng cho phép.
  - ngoài ra còn có 1 số api public, ai cũng có thể truy cập tới được.

- các chức năng hiện có của hệ thống

  - hệ thống đăng nhập qua username và password cùng với phân quyền và xác thực của JWT.
  - user có ảnh avatar mặc định
  - dịch vụ gửi mail (nên để chạy ngầm cho đỡ tốn công chờ)
  - dùng cache để giảm thiểu request tới db
  - upload/download file lên thẳng thư mục của hệ thống
  - upload/download file lên mongodb

- các chức năng trong tương lai
  - thêm phần websocket (có thể tạo ra brach or fork ra git mới để xây dựng)
    - chat 1:1, chat group
    - thông báo
  - gửi otp để xác thực khi đổi mk

## Note

- Ghi chú lại các vấn đề gặp phải trong quá trình phát triển dự án.
