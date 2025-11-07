const request = require('supertest')
const { expect } = require('chai')
const loginBase = require('../../fixtures/loginBase')
const { realizarLogin } = require('../../helpers/autenticacaoHelper')

require('dotenv').config()

describe('Autenticação - Rotas para login', () => {
    describe('POST /auth/login', () => {

        it('Deve retornar 200 - Login bem-sucedido.', async () => {
            const userData = { ...loginBase }
            
            const response = await realizarLogin(userData)

            expect(response.status).to.equal(200)
            expect(response.body.userId).to.be.a('number')
        })

        it('Deve retornar 400 - Email e senha são obrigatórios (faltando email)', async () => {
            const userData = { ...loginBase }
            delete userData.email

            const response = await realizarLogin(userData)

            expect(response.status).to.equal(400)
        })

        it('Deve retornar 400 - Email e senha são obrigatórios (faltando senha)', async () => {
            const userData = { ...loginBase }
            delete userData.senha

            const response = await realizarLogin(userData)

            expect(response.status).to.equal(400)
        })

        it('Deve retornar 401 - Credenciais inválidas (email incorreto)', async () => {
            const userData = { ...loginBase }
            userData.email = 'email@teste.com'

            const response = await realizarLogin(userData)

            expect(response.status).to.equal(401)
        })

        it('Deve retornar 401 - Credenciais inválidas (senha incorreta)', async () => {
            const userData = { ...loginBase }
            userData.senha = 'senha_incorreta'

            const response = await realizarLogin(userData)

            expect(response.status).to.equal(401)
        })
    })
})