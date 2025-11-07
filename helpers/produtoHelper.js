const request = require('supertest')

require('dotenv').config()

async function listarProdutos() {
    return await request(process.env.BASE_URL)
        .get('/products')
}

async function buscarProdutoPorId(produtoId) {
    return await request(process.env.BASE_URL)
        .get(`/products/${produtoId}`)
}

async function listarProdutosPorCategoria(categoria) {
    return await request(process.env.BASE_URL)
        .get(`/products?categoria=${categoria}`)
}

module.exports = {
    listarProdutos,
    buscarProdutoPorId,
    listarProdutosPorCategoria
}