const request = require('supertest')
const { expect } = require('chai')
const { obterToken } = require('../../helpers/autenticacao')
const adminBaseCriar = require('../../fixtures/adminBaseCriar.json')
const { cadastarProduto, deletarProduto, deletarProdutoSemToken } = require('../../helpers/produtoAdmin')


describe('Admin: Produtos Rotas de gerenciamento (CRUD) de produtos (Admin)', () => {
    describe('DELETE /admin/products/{id}', () => {

        let adminToken
        let productId
        let produtoData = { ...adminBaseCriar }

        beforeEach(async () => {

            // Token de usuário admin
            adminToken = await obterToken("admin@email.com", "123456")

            // Criar um produto para os testes de delete
            const produtoDeletar = { ...adminBaseCriar }
            produtoDeletar.nome = "Produto Deletar"
            produtoDeletar.descricao = "Descrição Deletar"
            produtoDeletar.preco = 47.99
            produtoDeletar.categoria = 'feminino'
            produtoDeletar.imagem_url = "https://url.atualizada.com/img.jpg"

            const response = await cadastarProduto(adminToken, produtoDeletar)
            productId = response.body.productId

        })

        it('Deve retornar 200 - Produto deletado com sucesso', async () => {

            const response = await deletarProduto(adminToken, productId)

            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Produto deletado com sucesso.')

        })

        it('Deve retornar 401 - Token de autenticação não fornecido', async () => {

            const response = await deletarProdutoSemToken(productId)

            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal('Token de autenticação não fornecido.')

        })

        it('Deve retornar 401 - Token inválido', async () => {

            const tokenInvalido = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'

            const response = await deletarProduto(tokenInvalido, productId)

            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal('Token inválido ou expirado.')

        })

        it('Deve retornar 403 - Acesso negado. Requer permissão de administrador', async () => {

            // Token de usuário comum (não admin)
            const userToken = await obterToken("user@email.com", "123456")

            const response = await deletarProduto(userToken, productId)

            expect(response.status).to.equal(403)
            expect(response.body.message).to.equal('Acesso negado. Requer permissão de administrador.')

        })

        it('Deve retornar 404 - Produto não encontrado', async () => {
            
            const idInexistente = 99999

            const response = await deletarProduto(adminToken, idInexistente)

            expect(response.status).to.equal(404)
            expect(response.body.message).to.equal('Produto não encontrado.')

        })
    })
})