const request = require('supertest');
const produtoBase = require('../fixtures/produtoBase.json')

require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3333'

const adicionarItem = async (produtoId, quantidade, token) => {
    const produtoData = { ...produtoBase }

    produtoData.productId = produtoId
    produtoData.quantidade = quantidade

    const response = await request(BASE_URL)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send(produtoData)


    return produtoId  

}

module.exports = {
    adicionarItem
};