# cabbage-api

## API

### Public

- GET /api/asset/files/:key

- POST /api/record/image

- POST /api/record/media

- POST /api/record/url

- GET /api/record/:uniqueId
回傳 Token 與資料

- POST /api/record/:uniqueId/password
輸入密碼回傳 Token

### Admin

### Note

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```
