const request = require('supertest')

require('dotenv').config()

async function fazerCheckout(token) {
    return await request(process.env.BASE_URL)
        .post('/order/checkout')
        .set('Authorization', `Bearer ${token}`)
}

async function fazerCheckoutSemToken() {
    return await request(process.env.BASE_URL)
        .post('/order/checkout')
}

module.exports = {
    fazerCheckout,
    fazerCheckoutSemToken
}
