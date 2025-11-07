const request = require('supertest')

require('dotenv').config()

async function adicionarItemCarrinho(token, produtoData) {
    return await request(process.env.BASE_URL)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send(produtoData)
}

async function adicionarItemCarrinhoSemToken(produtoData) {
    return await request(process.env.BASE_URL)
        .post('/cart/add')
        .send(produtoData)
}

async function verCarrinho(token) {
    return await request(process.env.BASE_URL)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
}

async function verCarrinhoSemToken() {
    return await request(process.env.BASE_URL)
        .get('/cart')
}

async function removerItemCarrinho(token, productId) {
    return await request(process.env.BASE_URL)
        .delete(`/cart/remove/${productId}`)
        .set('Authorization', `Bearer ${token}`)
}

async function removerItemCarrinhoSemToken(productId) {
    return await request(process.env.BASE_URL)
        .delete(`/cart/remove/${productId}`)
}

module.exports = {
    adicionarItemCarrinho,
    adicionarItemCarrinhoSemToken,
    verCarrinho,
    verCarrinhoSemToken,
    removerItemCarrinho,
    removerItemCarrinhoSemToken
}