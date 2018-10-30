const Koa = require('koa')
const router = require('./router')

const app = new Koa();

// 路由中间件
app
    .use(router.routes())
    .use(router.allowedMethods())

app.listen(8000)