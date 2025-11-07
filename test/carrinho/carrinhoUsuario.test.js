const request = require('supertest')
const { expect } = require('chai')
const { obterToken } = require('../../helpers/autenticacao')
const { verCarrinho } = require('../../helpers/carrinhoHelper')

require('dotenv').config()

describe('Carrinho - Rotas privadas para gerenciamento do carrinho', () => {
    describe('GET /cart', () => {

        let token

        beforeEach(async () => {
            token = await obterToken("user@email.com", "123456")
        })

        it('Deve retornar 200 - Retorna os itens e o valor total do carrinho', async () => {

            const response = await verCarrinho(token)

            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('items')
            expect(response.body).to.have.property('total')
        })

        it('Deve retorna 401 - Com token inválido', async () => {

            const tokenInvalido = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVaaa'

            const response = await verCarrinho(tokenInvalido)

            expect(response.status).to.equal(401)
        })

        it('Deve retorna 401 - Sem token', async () => {
            
            const tokenVazio = ''

            const response = await verCarrinho(tokenVazio)

            expect(response.status).to.equal(401)
        })

    })
})