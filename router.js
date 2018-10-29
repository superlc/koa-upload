const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')

const router = new Router()

const md5File = (file) =>{
    return new Promise((reslove, reject) => {
        let md5sum = crypto.createHash('md5')
        let stream = fs.createReadStream(file)
        stream.on('data', (chunk) => {
            md5sum.update(chunk)
        })
        stream.on('end', () => {
            let fileMd5 = md5sum.digest('hex')
            reslove(fileMd5)
        })
        stream.on('error', (err) => {
            reject(err)
        })
    })
}

router.post('/upload', async (ctx, next) => {
    console.log(ctx.req.files)
    console.log(ctx.request.body)
    console.log(ctx.req.body)
    // 上传单个文件
    const file = ctx.request.files.file

    const tempFile = file.path

    // 获取文件的md5名称
    const fileName = await md5File(tempFile)
    // 获取文件的后缀
    const ext = path.extname(tempFile)
    // 创建可读流
    const reader = fs.createReadStream(file.path)
    // 构造目标存储路径
    let filePath = `/usr/share/nginx/html/static/img/${fileName}${ext}`
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
    
    ctx.body = {
        code: 0,
        data: {
            url: `https://www.cluo.me/static/img/${fileName}${ext}`
        }
    }
})

module.exports = router