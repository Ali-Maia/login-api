const request = require('supertest')

require('dotenv').config()
const baseUrl = process.env.BASE_URL


const apiAuthLogin = async (email, senha, rememberMe) => {
  const resposta = await request(baseUrl)
  .post('/api/auth/login')
  .set('Content-Type', 'application/json')
  .send({ "email": email, "password": senha, "rememberMe": rememberMe })

  return resposta
}

const apiAuthResetPassword = async (email) => {
  const resposta = await request(baseUrl)
  .post('/api/auth/reset-password')
  .set('Content-Type', 'application/json')
  .send({ email: email })

  return resposta
}

const apiUsersProfileAuthenticated = async (token) => {
  const resposta = await request(baseUrl)
    .get('/api/users/profile')
    .set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${token}`)

  return resposta
}

const apiUsersProfileUpdate = async (name, token) => {
  const resposta = await request(baseUrl)
  .put('/api/users/profile')
  .set('Content-Type', 'application/json')
  .set('Authorization', `Bearer ${token}`)
  .send({name : name})

  return resposta
}

const apiUsersProfileDelete = async (token) => {
  const resposta = await request(baseUrl)
  .delete('/api/users/delete')
  .set('Content-Type', 'application/json')
  .set('Authorization', `Bearer ${token}`)

  return resposta
}

module.exports = { 
  apiAuthLogin, 
  apiAuthResetPassword, 
  apiUsersProfileAuthenticated, 
  apiUsersProfileUpdate, 
  apiUsersProfileDelete 
}
