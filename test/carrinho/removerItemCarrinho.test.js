const request = require('supertest')
const { expect } = require('chai')
const { obterToken } = require('../../helpers/autenticacao')
const { adicionarItem } = require('../../helpers/carrinho')
const { removerItemCarrinho } = require('../../helpers/carrinhoHelper')

require('dotenv').config()

describe('Carrinho - Rotas privadas para gerenciamento do carrinho', () => {
    describe('DELETE /cart/remove/productId', () => {

        let token
        let productId
        
        it('Deve retornar 200 - Item removido', async () => {

            token = await obterToken("user@email.com", "123456")
            
            productId = await adicionarItem(2, 2, token)

            const response = await removerItemCarrinho(token, productId)

            expect(response.status).to.equal(200)
        })

        it('Deve retornar 401 - quando o token é inválido', async () => {

            const tokenInvalido = 'kv1z_hQubKIGbS8mdsQZq8rXIpQsiPs1MjK1fZOc4Naaaaa'

            const response = await removerItemCarrinho(tokenInvalido, productId)

            expect(response.status).to.equal(401)
        })

        it('Deve retornar 401 - quando o token é expirado', async () => {

            const tokenExpirado = 'kv1z_hQubKIGbS8mdsQZq8rXIpQsiPs1MjK1fZOc4Na'

            const response = await removerItemCarrinho(tokenExpirado, productId)

            expect(response.status).to.equal(401)
        })

        it('Deve retornar 404 - quando o item não é encontrado no carrinho', async () => {
            
            // Usar um productId que não existe no carrinho
            const productIdInexistente = 999

            const response = await removerItemCarrinho(token, productIdInexistente)

            expect(response.status).to.equal(404)
        })
    })
})