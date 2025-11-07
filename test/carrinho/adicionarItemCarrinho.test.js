const request = require('supertest')
const { expect } = require('chai')
const { obterToken } = require('../../helpers/autenticacao')
const produtoBase = require('../../fixtures/produtoBase.json')
const { adicionarItemCarrinho, adicionarItemCarrinhoSemToken } = require('../../helpers/carrinhoHelper')

require('dotenv').config()

describe('Carrinho - Rotas privadas para gerenciamento do carrinho', () => {
    describe('POST /cart/add', () => {

        let token

        beforeEach(async () => {
            token = await obterToken("user@email.com", "123456")
        })

        it('Deve retorna 200 - Item adicionado/atualizado no carrinho', async () => {

            const produtoData = { ...produtoBase }

            const response = await adicionarItemCarrinho(token, produtoData)

            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('message', 'Item adicionado/atualizado com sucesso!')
            expect(response.body).to.have.property('cart')
            expect(response.body.cart).to.have.property('items')
            expect(response.body.cart).to.have.property('total')
        })

        it('Deve retornar 400 - quando produto não é fornecido', async () => {

            const produtoData = { ...produtoBase }
            delete produtoData.productId

            const response = await adicionarItemCarrinho(token, produtoData)

            expect(response.status).to.equal(400)   
        })

        it('Deve retornar 400 - quando quantidade não é fornecida', async () => {

            const produtoData = { ...produtoBase }
            delete produtoData.quantidade

            const response = await adicionarItemCarrinho(token, produtoData)

            expect(response.status).to.equal(400) 
        })

        it('Deve retornar 401 - quando o token não é fornecido', async () => {

            const produtoData = { ...produtoBase }

            const response = await adicionarItemCarrinhoSemToken(produtoData)

            expect(response.status).to.equal(401) 
        })

        it('Deve retornar 401 - quando o token é inválido', async () => {

            const produtoData = { ...produtoBase }
            const tokenInvalido = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVaaa'

            const response = await adicionarItemCarrinho(tokenInvalido, produtoData)

            expect(response.status).to.equal(401) 
        })

        it('Deve retornar 404 - quando o produto não existe', async () => {
            
            const produtoData = { ...produtoBase }
            produtoData.productId = 999

            const response = await adicionarItemCarrinho(token, produtoData)

            expect(response.status).to.equal(404) 
        })
    })
})