const { expect } = require('chai')

const { cadastrarUsuario } = require('../../helpers/auth')
const gerarUsuario = require('../../helpers/gerarUsuario')
const { apiAuthResetPassword } = require('../../helpers/common')

const usuario = gerarUsuario()
const login = { ...usuario }


describe('Reset de Senha - POST /api/auth/reset-password', () => {

  // Registra um usuário antes de executar os testes de reset
  before(async () => {
    await cadastrarUsuario(login.name, login.email, login.password)
  })

  it('StatusCode 200 - Deve enviar e-mail de redefinição de senha com sucesso, quando e-mail for válido', async () => {
    const resposta = await apiAuthResetPassword(login.email)

    expect(resposta.status).to.equal(200)
    expect(resposta.body.message).to.equal('Email de redefinição enviado com sucesso')
  })

  it('StatusCode 404 - Não deve permitir redefinição de senha para e-mail inexistente', async () => {
    const resposta = await apiAuthResetPassword("rafael@email.com")

    expect(resposta.status).to.equal(404)
    expect(resposta.body).to.have.property('error')
    expect(resposta.body.message).to.equal('Usuário não encontrado')
  })
})