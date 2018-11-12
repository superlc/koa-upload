const mongoose = require('mongoose')
const Schema = mongoose.Schema

const modelSymbol = Symbol()

const bookingSchema = new Schema({
    name: String,
    sex: String, // M/F
    pinyin: String,
    oldName: String,
    age: Number,
    country: String,
    id: String,
    region: Array,
    address: String,
    education: String,
    phone: String,
    telephone: String,
    smg: String,
    contactTime: String,
    registerCenter: String,

    company: String,
    duty: String,

    emergencyName: String,
    emergencyId: String,
    emergencyAddress: String,
    emergencyTelephone: String,

    childrenNum: Number,
    foreignChildrenNum: Number,

    appoitedSeracherName: String,
    appoitedSeracherId: String,

    appoitedDrawerName: String,
    appoitedDrawerId: String,
    volunteerId: String,
    // 财产涉及类型
    fareArr: Array
});

class Booking {
    constructor() {
        this[modelSymbol] = mongoose.model('Booking', bookingSchema)
    }
    getModel() {
        return this[modelSymbol]
    }
}

module.exports = Booking