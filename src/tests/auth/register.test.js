const { expect } = require('chai')

const { cadastrarUsuario } = require('../../helpers/auth')
const gerarUsuario = require('../../helpers/gerarUsuario')

const usuario = gerarUsuario()


describe('Registro de Usuário - POST /api/auth/register', () => {
  it('StatusCode 201 - Registrar um novo usuário com sucesso.', async () => {
    const token = await cadastrarUsuario(usuario.name, usuario.email, usuario.password)
    expect(token).to.be.a('string')
  })  
})