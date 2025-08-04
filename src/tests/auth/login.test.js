const request = require('supertest')
const { expect } = require('chai')

const { baseUrl } = require('../../config/environment')
const { cadastrarUsuario } = require('../../helpers/auth')
const gerarUsuario = require('../../helpers/gerarUsuario')

const usuario = gerarUsuario()
const login = { ...usuario }


describe('Login de Usuário - POST /api/auth/login', () => {

  // Registra um usuário antes de executar os testes de login
  before(async () => {
    await cadastrarUsuario(login.name, login.email, login.password)
  })

  it('StatusCode 200 - Autenticar com sucesso um usuário já cadastrado sem a opção de lembrar-me.', async () => {
    const resposta = await request(baseUrl)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ ...login })

    expect(resposta.status).to.equal(200)
    expect(resposta.body.token).to.be.a('string')
  })
  it('StatusCode 200 - Autenticar com sucesso um usuário já cadastrado com opção de lembrar-me.', async () => {
    const resposta = await request(baseUrl)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ ...login, rememberMe: true })

    expect(resposta.status).to.equal(200)
    expect(resposta.body.token).to.be.a('string')

    const cookies = resposta.headers['set-cookie']
    expect(cookies).to.be.an('array')

    const tokenCookie = cookies.find(cookie => cookie.startsWith('token='))
    expect(tokenCookie).to.exist
    expect(tokenCookie).to.match(/Max-Age=2592000|Expires=/) // 30 dias em segundos
  })

  it('StatusCode 400 - Impedir login com e-mail e senha inválidos', async () => {
    const resposta = await request(baseUrl)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ "email": "@", "password": "#R" })

    expect(resposta.statusCode).to.equal(400)
    expect(resposta.body).to.have.property('error')
    expect(resposta.body.message).to.equal('Verifique os dados enviados')
    expect(resposta.body.details[0]).to.have.property('field', 'email')
    expect(resposta.body.details[0]).to.have.property('message', 'Email inválido')
  })

  it('StatusCode 401 - Impedir login com e-mail incorreta.', async () => {
    // EMAIL DINÂMICO - nunca será bloqueado
    const emailDinamico = `teste-${Date.now()}-${Math.random()}@email.com`

    const resposta = await request(baseUrl)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ "email": emailDinamico, "password": "Senha@123" })


    expect(resposta.statusCode).to.equal(401)
    expect(resposta.body).to.have.property('error')
    expect(resposta.body.message).to.equal('Email ou senha inválidos')
  })

  it('StatusCode 401 - Impedir login com senha incorreta.', async () => {
    // EMAIL DINÂMICO - nunca será bloqueado
    const emailDinamico = `teste-${Date.now()}-${Math.random()}@email.com`

    const resposta = await request(baseUrl)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ "email": emailDinamico, "password": "senha@123" })

    expect(resposta.statusCode).to.equal(401)
    expect(resposta.body).to.have.property('error')
    expect(resposta.body.message).to.equal('Email ou senha inválidos')
  })

  it('StatusCode 403 - Deve bloquear o usuário após 3 tentativas de login inválidas', async () => {

    // EMAIL DINÂMICO para teste de bloqueio
    const emailTeste = `teste-bloqueio-${Date.now()}@example.com`

    // Fazemos 3 tentativas e verificamos que cada uma retorna 401
    for (let i = 0; i < 3; i++) {
      const tentativa = await request(baseUrl)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ "email": emailTeste, "password": "senha@123" })

      expect(tentativa.statusCode).to.equal(401)
    }

    // Na 4ª tentativa, deve estar bloqueado (403)
    const bloqueio = await request(baseUrl)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ "email": emailTeste, "password": "senha@123" })

    expect(bloqueio.statusCode).to.equal(403)
    expect(bloqueio.body.message).to.equal('Conta bloqueada. Tente novamente em 30 minutos.')
  })
})