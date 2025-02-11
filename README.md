# cabbage-api

## API

### Public

- POST /api/asset/upload

- GET /api/asset/files/:key

- POST /api/record/image

- POST /api/record/media

- POST /api/record/url

- GET /api/record/:uniqueId

- POST /api/record/:uniqueId

### Admin

### Note

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```
