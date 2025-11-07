const request = require('supertest')
const { expect } = require('chai')
const { obterToken } = require('../../helpers/autenticacao')
const adminBaseCriar = require('../../fixtures/adminBaseCriar.json')
const { cadastarProduto, cadastarProdutoSemToken } = require('../../helpers/produtoAdmin')

require('dotenv').config()

describe('Admin: Produtos - Rotas de gerenciamento (CRUD) de produtos (Admin)', () => {
    describe('POST /admin/products', () => {

        let adminToken
        let produtoData = { ...adminBaseCriar }

        beforeEach(async () => {
            // Token de usuário admin
            adminToken = await obterToken("admin@email.com", "123456")
        })

        it('Deve retornar 201 - Produto cadastrado com sucesso (Admin)', async () => {

            const produtoCadastrar = { ...adminBaseCriar }
            produtoCadastrar.nome = "Produto Cadastrado"
            produtoCadastrar.descricao = "Descrição Cadastrado"
            produtoCadastrar.preco = 99.99
            produtoCadastrar.categoria = 'feminino'
            produtoCadastrar.imagem_url = "https://url.cadastrado.com/img.jpg"

            const response = await cadastarProduto(adminToken, produtoCadastrar)

            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Produto criado com sucesso!')
            expect(response.body.productId).to.be.a('number')
        })

        it('Deve retornar 401 - Token não fornecido', async () => {

            const response = await cadastarProdutoSemToken(produtoData)

            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal('Token de autenticação não fornecido.')
        })

        it('Deve retornar 401 - Token inválido', async () => {

            const tokenInvalido = 'RXjleCjlsaBnDmtkX9cPKTAS3ISUnEZsMJRQWP23aaa'

            const response = await cadastarProduto(tokenInvalido, produtoData)

            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal('Token inválido ou expirado.')
        })

        it('Deve retornar 403 - Usuário não é admin', async () => {

            // Token de usuário comum (não admin)
            const userToken = await obterToken("user@email.com", "123456")

            const response = await cadastarProduto(userToken, produtoData)

            expect(response.status).to.equal(403)
            expect(response.body.message).to.equal('Acesso negado. Requer permissão de administrador.')
        })

        it('Deve retornar 400 - Dados obrigatórios ausentes (nome)', async () => {

            const produtoTeste = { ...adminBaseCriar }
            delete produtoTeste.nome

            const response = await cadastarProduto(adminToken, produtoTeste)

            expect(response.status).to.equal(400)
            expect(response.body.message).to.include('obrigatórios')
        })

        it('Deve retornar 400 - Dados obrigatórios ausentes (preço)', async () => {

            const produtoTeste = { ...adminBaseCriar }
            delete produtoTeste.preco

            const response = await cadastarProduto(adminToken, produtoTeste)

            expect(response.status).to.equal(400)
            expect(response.body.message).to.include('obrigatórios')
        })

        it('Deve retornar 400 - Categoria inválida', async () => {

            const produtoTeste = { ...adminBaseCriar }
            produtoTeste.categoria = 'categoria_inexistente'

            const response = await cadastarProduto(adminToken, produtoTeste)
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Categoria inválida. Use: feminino, masculino, unissex')
        })

        it('Deve retornar 400 - Preço inválido (negativo)', async () => {

            const produtoTeste = { ...adminBaseCriar }
            produtoTeste.preco = -10.50

            const response = await cadastarProduto(adminToken, produtoTeste)

            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Preço deve ser um número positivo.')

        })
    })
})