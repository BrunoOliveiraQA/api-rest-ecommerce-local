const request = require('supertest');
const loginBase = require('../fixtures/loginBase.json')

require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3333'

let userData = { ...loginBase }

const obterToken = async (email, senha) => {

    userData.email = email
    userData.senha = senha

    const response = await request(BASE_URL)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send(userData)

    return response.body.token
}


module.exports = {
    obterToken
}
