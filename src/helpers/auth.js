const request = require('supertest')
const baseUrl = process.env.BASE_URL

require('dotenv').config()

const obterToken = async (name, email, password) => {
  const postLogin = { 
    name: name,
    email: email, 
    password: password 
  }

  const resposta = await request(baseUrl)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send(postLogin)

    return resposta.body.token
}

const cadastrarUsuario = async (name, email, password) => {
  const postRegister = { name, email, password }

  const resposta = await request(baseUrl)
    .post('/api/auth/register')
    .set('Content-Type', 'application/json')
    .send(postRegister)

  return resposta.body.token
}

module.exports = { obterToken, cadastrarUsuario }