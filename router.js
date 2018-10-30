const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const Router = require('koa-router')
const formidable = require('formidable')

const router = new Router()

const localImgDir = '/data/sftp/cluo/upload/static/img/'
// const localImgDir = 'E:\\Code\\koa-upload\\aaa\\bbb\\ccc\\'
const hostImgDir = 'https://www.cluo.me/static/img/'

/**
 * 根据给定的文件生成md5的值，文件不变则md5值不变
 * @param {string} file 
 */
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
/**
 * 解析客户端的request，转换multi-form的数据
 * @param {stream} req 
 */
const formReq = (req) => {
    return new Promise((reslove, reject) => {
        const form = new formidable.IncomingForm()
        form.parse(req, (err, fields, files) => {
            console.log(fields)
            console.log(files)
            if (err) {
                reject(err)
            } else {
                reslove({
                    fields,
                    files
                })
            }
        })
    })
}

/**
 * 判断给定的路径是否为目录
 * @param {boolean} dirPath 
 */
const isDirExist = (dirPath) => {
    try{
        // statSync在目录不存在时会抛出异常
        const stat = fs.statSync(dirPath)
        return stat.isDirectory()
    } catch(e) {
        return false
    }
}
/**
 * 对给定的目标文件路径探测是否路径中的目录是否都已创建过，没有则创建
 * @param {string} filePath 
 */
const createFilePath = (filePath) => {
    return new Promise((resolve, reject) => {
        try {
            let originPath = filePath
            let dir = path.dirname(originPath)
            const unExistedDirs = []
            while(dir !== originPath) {
                console.log(dir)
                if (isDirExist(dir)) {
                    break
                } else {
                    unExistedDirs.unshift(dir)
                }
                originPath = dir
                dir = path.dirname(originPath)
            }
            console.log(unExistedDirs)
            unExistedDirs.forEach(item => {
                fs.mkdirSync(item)
            })
            resolve(true)
        } catch(e) {
            console.log(e)
            reject(false)
        }
    })
}

router.post('/upload', async (ctx, next) => {
    const formResult = await formReq(ctx.req)
    // 上传单个文件
    const file = formResult.files.file
    
    const tempFile = file.path

    // 获取文件的md5名称
    const fileName = await md5File(tempFile)
    // 获取文件的后缀
    const ext = path.extname(file.name)
    // 创建可读流
    const reader = fs.createReadStream(tempFile)
    // 构造目标存储路径
    let filePath = `${localImgDir}${fileName}${ext}`

    let createPathResult = await createFilePath(filePath)
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
    
    ctx.body = {
        code: 0,
        data: {
            url: `${hostImgDir}${fileName}${ext}`
        }
    }
})

module.exports = router
