const { expect } = require('chai')
const { obterToken } = require('../../helpers/autenticacao')
const adminBaseCriar = require('../../fixtures/adminBaseCriar.json')
const { cadastarProduto, atualizarProduto, atualizarProdutoSemToken } = require('../../helpers/produtoAdmin')

require('dotenv').config()

describe('Admin: Produtos - Rotas de gerenciamento (CRUD) de produtos (Admin)', () => {
    describe('PUT /admin/products/{id}', () => {
        
        let adminToken
        let produtoData = { ...adminBaseCriar }
        let productId

        beforeEach(async () => {
            // Token de usuário admin
            adminToken = await obterToken("admin@email.com", "123456")
            // Criar um produto para os testes de atualização
            const produtoTeste = { ...adminBaseCriar }
            produtoTeste.nome = "Produto Para Atualizar"
            
            const response = await cadastarProduto(adminToken, produtoTeste)
            productId = response.body.productId

        })
        
        it('Deve retornar 200 - Produto atualizado com sucesso', async () => {
            console.log("VERIFICANDO O TOKEN", adminToken)
            const produtoAtualizado = { ...adminBaseCriar }
            produtoAtualizado.nome = "Produto Atualizado"
            produtoAtualizado.descricao = "Descrição atualizada"
            produtoAtualizado.preco = 99.99
            produtoAtualizado.categoria = 'masculino'
            produtoAtualizado.imagem_url = "https://url.atualizada.com/img.jpg"
            
            const response = await atualizarProduto(adminToken, productId, produtoAtualizado)
            
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Produto atualizado com sucesso!')
        })
        
        it('Deve retornar 400 - Requisição inválida. Verifique os dados enviados', async () => {
            
            const produtoInvalido = { 
                categoria: 'categoria_inexistente',
                preco: '-10,00'
            }
            
            const response = await atualizarProduto(adminToken, productId, produtoInvalido)
            
            expect(response.status).to.equal(400)
            expect(response.body.message).to.include('Preço deve ser um número positivo.')
        })

        it('Deve retornar 401 - Token de autenticação não fornecido', async () => {
            const produtoAtualizado = { ...adminBaseCriar }
            produtoAtualizado.nome = "Produto Sem Token"

            const response = await atualizarProdutoSemToken(productId, produtoAtualizado)

            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal('Token de autenticação não fornecido.')
        })

        it('Deve retornar 401 - Token inválido', async () => {
            const produtoAtualizado = { ...adminBaseCriar }
            produtoAtualizado.nome = "Produto Token Inválido"
            const tokenInvalido = 'token.invalido.aqui'

            const response = await atualizarProduto(tokenInvalido, productId, produtoAtualizado)

            expect(response.status).to.equal(401)
            expect(response.body.message).to.equal('Token inválido ou expirado.')
        })

        it('Deve retornar 403 - Acesso negado. Requer permissão de administrador', async () => {
            const userToken = await obterToken("user@email.com", "123456")
            const produtoAtualizado = { ...adminBaseCriar }
            produtoAtualizado.nome = "Produto Usuário Comum"

            const response = await atualizarProduto(userToken, productId, produtoAtualizado)

            expect(response.status).to.equal(403)
            expect(response.body.message).to.equal('Acesso negado. Requer permissão de administrador.')
        })

        it('Deve retornar 404 - Recurso não encontrado', async () => {
            const produtoAtualizado = { ...adminBaseCriar }
            produtoAtualizado.nome = "Produto Inexistente"
            const idInexistente = 99999

            const response = await atualizarProduto(adminToken, idInexistente, produtoAtualizado)

            expect(response.status).to.equal(404)
            expect(response.body.message).to.equal('Produto não encontrado ou nenhum dado foi alterado.')
        })
    })
})