const Koa = require('koa')
const router = require('./router')
var bodyParser = require('koa-bodyparser');

const app = new Koa();

 // 对请求的参数json化
 app.use(bodyParser());
 
// 路由中间件
app
    .use(router.routes())
    .use(router.allowedMethods())

console.log('Listening on port：8000')
app.listen(8000)