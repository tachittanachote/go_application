const Vonage = require('@vonage/server-sdk')
require('dotenv').config();
const Utils = require('./utils')
const opts = {"type":"unicode"}

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
})

exports.requestOtp = (phoneNumber, message) => {
    console.log("Real otp requested")
    return new Promise((resolve, reject) => {
        vonage.message.sendSms(process.env.APP_NAME, phoneNumber, message, (err, res) => {
            if (err) reject(err);
            resolve(res.messages[0]['status'])
        })
    })
}

exports.sendMessage = (phoneNumber, message) => {
    console.log("Send message")
    return new Promise((resolve, reject) => {
        vonage.message.sendSms(process.env.APP_NAME, Utils.formatPhoneNumber(phoneNumber), message, (err, res) => {
            if (err) reject(err);
            resolve(res.messages[0]['status'])
        })
    })
}

exports.sendUnicodeMessage = (phoneNumber, message) => {
    console.log("Send message")
    return new Promise((resolve, reject) => {
        vonage.message.sendSms(process.env.APP_NAME, Utils.formatPhoneNumber(phoneNumber), message, opts, (err, res) => {
            if (err) reject(err);
            resolve(res.messages[0]['status'])
        })
    })
}
