const Koa = require('koa')
const koaBody = require('koa-body');

const router = require('./router')

const app = new Koa();
// body解析中间件    
app
    .use(koaBody())

// 路由中间件
app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(8000)