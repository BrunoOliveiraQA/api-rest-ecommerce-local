const request = require('supertest')
const { expect } = require('chai')
const registerBase = require('../../fixtures/registerBase.json')
const { realizarRegistro } = require('../../helpers/autenticacaoHelper')

require('dotenv').config()

describe('Autenticação - Rotas para registro', () => {
    describe('POST /auth/register', () => {

        it('Deve retornar 201 - Usuário cadastrado com sucesso', async () => {
            const userData = { ...registerBase }
            userData.email = `teste_${Date.now()}@email.com`

            const response = await realizarRegistro(userData)

            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Usuário cadastrado com sucesso!')
        })

        it('Deve retornar 400 - Todos os campos são obrigatórios (faltando nome)', async () => {
            const userData = { ...registerBase }
            delete userData.nome

            const response = await realizarRegistro(userData)

            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Todos os campos são obrigatórios (nome, email, senha, whatsapp).')
        })

        it('Deve retornar 400 - Todos os campos são obrigatórios (faltando email)', async () => {
            const userData = { ...registerBase }
            delete userData.email

            const response = await realizarRegistro(userData)

            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Todos os campos são obrigatórios (nome, email, senha, whatsapp).')
        })

        it('Deve retornar 400 - Todos os campos são obrigatórios (faltando senha)', async () => {
            const userData = { ...registerBase }
            delete userData.senha

            const response = await realizarRegistro(userData)

            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Todos os campos são obrigatórios (nome, email, senha, whatsapp).')
        })

        it('Deve retornar 400 - Todos os campos são obrigatórios (faltando whatsapp)', async () => {
            const userData = { ...registerBase }
            delete userData.whatsapp

            const response = await realizarRegistro(userData)

            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Todos os campos são obrigatórios (nome, email, senha, whatsapp).')
        })

        it('Deve retornar 409 - Email já cadastrado', async () => {
            const userData = { ...registerBase }

            const response = await realizarRegistro(userData)

            expect(response.status).to.equal(409)
            expect(response.body.message).to.equal('Este email já está cadastrado.')
        })
    })
})