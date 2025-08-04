const request = require('supertest')
const { expect } = require('chai')

const { baseUrl } = require('../../config/environment')
const { cadastrarUsuario } = require('../../helpers/auth')
const gerarUsuario = require('../../helpers/gerarUsuario')

const usuario = gerarUsuario()
const login = { ...usuario }



describe('Reset de Senha - POST /api/auth/reset-password', () => {

  // Registra um usuário antes de executar os testes de reset
  before(async () => {
    await cadastrarUsuario(login.name, login.email, login.password)
  })

  it('StatusCode 200 - Deve enviar e-mail de redefinição de senha com sucesso, quando e-mail for válido', async () => {
    const resposta = await request(baseUrl)
      .post('/api/auth/reset-password')
      .set('Content-Type', 'application/json')
      .send({ email: login.email })

    expect(resposta.status).to.equal(200)
    expect(resposta.body.message).to.equal('Email de redefinição enviado com sucesso')
  })

  it('StatusCode 404 - Não deve permitir redefinição de senha para e-mail inexistente', async () => {
    const resposta = await request(baseUrl)
      .post('/api/auth/reset-password')
      .set('Content-Type', 'application/json')
      .send({ email: "rafael@email.com" })

    expect(resposta.status).to.equal(404)
    expect(resposta.body).to.have.property('error')
    expect(resposta.body.message).to.equal('Usuário não encontrado')
  })
})