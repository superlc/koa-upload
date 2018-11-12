const db = require('../db/index')
const Booking = require('../modules/booking')


const testFunc = async () => {
    const connectResult = await db.connect()

    if (connectResult.status) {
        // 获取Post的model类
        const BookingModel = new Booking().getModel()
        // 创建一个基于PostModel的实例，这个地方跟其他的引用model的能力不同，必须如此
        const booking = new BookingModel({
            name: 'cluo',
            sex: 'M',
            age: 31,
            id: '42900119870610045X',
            country: '中国'
        })

        const result = await booking.save()

        console.log(result)
    } else {
        
    }
}

testFunc()