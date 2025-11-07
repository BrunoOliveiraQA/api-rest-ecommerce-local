const request = require('supertest')

require('dotenv').config()


async function realizarLogin(userData) {
    return await request(process.env.BASE_URL)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send(userData)
}


async function realizarRegistro(userData) {
    return await request(process.env.BASE_URL)
        .post('/auth/register')
        .set('Content-Type', 'application/json')
        .send(userData)
}

module.exports = {
    realizarLogin,
    realizarRegistro
}