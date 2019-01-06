const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const formidable = require('formidable')

const db = require('./db/index')
const Booking = require('./modules/booking')

const router = new Router()

// 添加登记记录
router.post('/api/will/booking/add', async (ctx, next) => {
    const params = ctx.request.body

    // 校验params中的后台业务逻辑，比如统一身份证只能登记一次

    const connectResult = await db.connect()

    if (connectResult.status) {
        // 获取Post的model类
        const BookingModel = new Booking().getModel()
        // 创建一个基于PostModel的实例，这个地方跟其他的引用model的能力不同，必须如此
        const booking = new BookingModel(params)

        const result = await booking.save()

        console.log(result)
        ctx.body = {
            code: 0,
            data: {
                ...result
            }
        }
    } else {
        ctx.body = {
            code: 999,
            message: '登记失败'
        }
    }
})

// 加密方法
const encrypt = (data) => {
	const key = fs.readFileSync('rsa/pub.key', { encoding: 'utf8'})
	// 注意，第二个参数是Buffer类型
	return crypto.publicEncrypt(key, Buffer.from(data))
}

// 查询记录
router.post('/api/will/bookings', async (ctx, next) => {
    // 获取客户端发来的数据
    const params = ctx.request.body
    const connectResult = await db.connect()

    if (connectResult.status) {
        const booking = new Booking().getModel()
        const result = await booking.find({})
        const resultStr = JSON.stringify(result)
        const resultEncodedBase64 = encrypt(resultStr).toString('base64')
        ctx.body = {
            code: 0,
            data: {
                bookings: resultEncodedBase64
            }
        }
    } else {
        ctx.body = {
            code: 999,
            message: '查询失败'
        }
    }
})
module.exports = router
