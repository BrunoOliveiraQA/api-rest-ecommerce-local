const request = require('supertest')
const { expect } = require('chai')
const { listarProdutos, listarProdutosPorCategoria } = require('../../helpers/produtoHelper')

require('dotenv').config()

describe('Produtos - Rotas públicas de visualização do catálogo', () => {
    describe('GET /products', () => {
        
        it('Deve retornar 200 - Lista de produtos', async () => {
            const response = await listarProdutos()

            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')
        })

        it('Deve retornar 200 - produtos com as propriedades corretas', async () => {
            const response = await listarProdutos()

            expect(response.status).to.equal(200)
            
            const primeiroProduto = response.body[0]
            
            expect(primeiroProduto).to.have.property('id')
            expect(primeiroProduto).to.have.property('nome')
            expect(primeiroProduto).to.have.property('descricao')
            expect(primeiroProduto).to.have.property('preco')
            expect(primeiroProduto).to.have.property('categoria')
            expect(primeiroProduto).to.have.property('imagem_url')
        })

        it('Deve retornar 200 - produtos da categoria feminino', async () => {
            const response = await listarProdutosPorCategoria('feminino')

            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')
        })

        it('Deve retornar 200 - produtos da categoria masculino', async () => {
            const response = await listarProdutosPorCategoria('masculino')

            expect(response.status).to.equal(200)
            expect(response.body).to.be.an('array')
        })
        
    })
})