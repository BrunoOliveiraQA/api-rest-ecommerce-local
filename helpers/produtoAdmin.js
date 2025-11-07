const request = require('supertest')

require('dotenv').config()

async function cadastarProduto(token, produtoData) {

    return await request(process.env.BASE_URL)
        .post('/admin/products')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send(produtoData)
}

async function cadastarProdutoSemToken(produtoData) {
    
    return await request(process.env.BASE_URL)
        .post('/admin/products')
        .set('Content-Type', 'application/json')
        .send(produtoData)

}

async function atualizarProduto(token, productId, produtoData) {

    return await request(process.env.BASE_URL)
        .put(`/admin/products/${productId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(produtoData)

}

async function atualizarProdutoSemToken(productId, produtoData) {

    return await request(process.env.BASE_URL)
        .put(`/admin/products/${productId}`)
        .set('Content-Type', 'application/json')
        .send(produtoData)

}

async function deletarProduto(token, productId) {

    return await request(process.env.BASE_URL)
        .delete(`/admin/products/${productId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)

}

async function deletarProdutoSemToken(productId) {

    return await request(process.env.BASE_URL)
        .delete(`/admin/products/${productId}`)
        .set('Content-Type', 'application/json')

}


module.exports = {
    cadastarProduto,
    cadastarProdutoSemToken,
    atualizarProduto,
    atualizarProdutoSemToken,
    deletarProduto,
    deletarProdutoSemToken
}