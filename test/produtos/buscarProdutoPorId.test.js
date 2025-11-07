const request = require('supertest')
const { expect } = require('chai')
const { buscarProdutoPorId } = require('../../helpers/produtoHelper')
const { obterToken } = require('../../helpers/autenticacao')
const { cadastarProduto } = require('../../helpers/produtoAdmin')
const adminBaseCriar = require('../../fixtures/adminBaseCriar.json')

require('dotenv').config()

describe('Produtos - Rotas públicas de visualização do catálogo', () => {
    describe('GET /products/{id}', () => {

        let adminToken
        let productId

        beforeEach(async () => {

            // 1. Obter token admin
            adminToken = await obterToken("admin@email.com", "123456")

            const produtoCadastrar = { ...adminBaseCriar }
            produtoCadastrar.nome = "Produto Cadastrado"
            produtoCadastrar.descricao = "Descrição Cadastrado"
            produtoCadastrar.preco = 99.99
            produtoCadastrar.categoria = 'feminino'
            produtoCadastrar.imagem_url = "https://url.cadastrado.com/img.jpg"

            // 2. Cadastrar produto
            const responseCadastro = await cadastarProduto(adminToken, produtoCadastrar)

            // 3. Extrair ID do produto
            productId = responseCadastro.body.productId

        })

        it('Deve retornar 200 - Com detalhes do produto', async () => {

            const response = await buscarProdutoPorId(productId)

            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('id', productId)
        })

        it('Deve retornar 200 - produto com todas as propriedades', async () => {

            const response = await buscarProdutoPorId(productId)

            expect(response.status).to.equal(200)

            const produto = response.body

            expect(produto).to.have.property('id')
            expect(produto).to.have.property('nome')
            expect(produto).to.have.property('descricao')
            expect(produto).to.have.property('preco')
            expect(produto).to.have.property('categoria')
            expect(produto).to.have.property('imagem_url')
        })

        it('Deve retornar 404 - Produto não encontrado', async () => {

            const productId = 99999

            const response = await buscarProdutoPorId(productId)

            expect(response.status).to.equal(404)
            expect(response.body.message).to.equal('Produto não encontrado.')
        })

    })
})