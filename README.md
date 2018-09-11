# HB Backend Task

HB Backend Task is a NodeJS app to implement the task found here - https://github.com/hackerbay/interview-backend-task. It is a microservice which has three endpoints which perform tasks of authentification, JSON Patch-ing and creating thumbnails from public image resource URLS.

## Installation
### For Production

Run the following commands to setup for production:

```bash
git clone https://github.com/NateNjuguna/hb-backend-task.git && cd hb-backend-task
npm install
NODE_ENV=production HB_PORT=8000 HB_SECRET=<your app's JWT secret> npm start
```

This will install the necessary dependencies, set temporary environment variables required by the app and start an express server at <http://0.0.0.0:8000>. Error logs are written to the `hb-backend-task_error.log` file in the installation folder.

### For Development

Run the following commands to setup for development:

```bash
git clone https://github.com/NateNjuguna/hb-backend-task.git && cd hb-backend-task
npm install
export NODE_ENV=development
export HB_PORT=8001
export HB_SECRET=<any JWT secret>
npm start
```

This will install the necessary dependencies, set temporary environment variables required by the app and start an express server at <http://0.0.0.0:8001>. Error logs are written to standard output (the console) and the `hb-backend-task_debug.log` file in the installation folder.

### Docker
A public docker image is available at [https://hub.docker.com/r/natenjuguna/hb-backend-task/](https://hub.docker.com/r/natenjuguna/hb-backend-task/)

## Testing

Testing can be done by using the following command in your installation directory:

```bash
HB_PORT=3000 HB_SECRET=<a test JWT secret> npm test
```

This will run test suites and generate HTML code coverage reports in the `coverage` directory of your installation. Test logs would be found in the `hb-backend-task_test.log` file in the installation folder.

## Usage

The microservice has three endpoints. `/auth` for authentication, `/patch` endpoint for patching json documents and `/thumbnail` endpoint for generating 50x50 px image thumbnails from public image resource URLs.

## API

| Endpoint | Method | Auth | Request | Response |
| :--- | :---: | :--- | :--- | :--- |
| `/auth` | POST | none | `{"email": String, "password": String}`<br>a *valid email* and a password which is *not NULL* in JSON format | `{"token": String}`<br> a JWT token that expires in 3559 seconds |
| `/patch` | PATCH | HTTP HEADER<br>`Authorization: Bearer <JWT>`<br>where JWT is a valid token returned from authentification on `/auth` | `{"document": {...}, "patch": {}}`<br>OR<br>`{"document": {...}, "patch": [{},{},{},...,{}]}`<br>a *valid* JSON document and *valid* patch operation(s) to be performed on it. Patches are in the format<br>`{"op": "<operation>", "path":"<json path>"[, "value":<some value>]}` | `{...}`<br> an updated JSON document (i.e. including patches applied to the original document) |
| `/thumbnail` | POST | HTTP HEADER<br>`Authorization: Bearer <JWT>`<br>where JWT is a valid token returned from authentification on `/auth` | `{"url": "http(s)://..."}`<br>a publicly available and *valid* image url | `<png image data>`<br> a 50px by 50px png image in the response body |
### NOTE
> Any endpoint not defined here will receive a `HTTP/1.1 404 Not Found` response. Likewise any endpoint accessed incorrectly will receive a `HTTP/1.1 405 Method Not Allowed` response. Any incorrect data formats in the requests will receive a `HTTP/1.1 400 Bad Request` response.

## Troubleshooting

- Ensure you set the HB_PORT and HB_SECRET environment variables correctly each time you start the server
- Please use available ports on your setup for the app and tests to run correctly.
- Also ensure you have an active internet connection.

## LICENSE

[MIT](LICENSE)
