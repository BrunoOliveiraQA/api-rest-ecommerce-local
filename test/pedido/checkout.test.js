const request = require('supertest')
const { expect } = require('chai')
const { obterToken } = require('../../helpers/autenticacao')
const { adicionarItem } = require('../../helpers/carrinho')
const { fazerCheckout, fazerCheckoutSemToken } = require('../../helpers/checkoutHelper')

require('dotenv').config()

describe('Pedido (Checkout) - Rota privada para finalizar a compra', () => {
    describe('POST - /order/checkout', () => {

        let token
        
        beforeEach(async () => {
            token = await obterToken("user@email.com", "123456")
        })

        it('Deve retornar 200 - Link do WhatsApp gerado com sucesso', async () => {

            await adicionarItem(2, 2, token)

            const response = await fazerCheckout(token)

            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Pedido pronto para ser enviado via WhatsApp!')
            expect(response.body.whatsappUrl).to.include('https://wa.me/')
            expect(response.body.whatsappUrl).to.be.a('string')
        })

        it('Deve retornar 400 - Carrinho está vazio', async () => {
           
            const response = await fazerCheckout(token)

            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Seu carrinho está vazio.')
        })

        it('Deve retornar 401 - Token não fornecido', async () => {
            const response = await fazerCheckoutSemToken()

            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal('Token de autenticação não fornecido.')
        })

        it('Deve retornar 401 - Token inválido', async () => {
            const tokenInvalido = 'kv1z_hQubKIGbS8mdsQZq8rXIpQsiPs1MjK1fZOc4Naaaaa'
            
            const response = await fazerCheckout(tokenInvalido)

            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal('Token inválido ou expirado.')
        })
    })
})