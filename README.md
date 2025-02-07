# cabbage-api

## API


### Public

* post /asset/upload

* POST /shorten/image

* POST /shorten/media

* POST /shorten/url

* GET  /shorten/:uniqueId

* POST /shorten/:uniqueId

### Admin


### Note
```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```