const request = require('supertest')
const { expect } = require('chai')
const { cadastrarUsuario } = require('../helpers/auth')
const gerarUsuario = require('../helpers/gerarUsuario')
require('dotenv').config()
const baseUrl = process.env.BASE_URL
const usuario = gerarUsuario()
const login = { ...usuario }


describe('Usuários', () => {
  let token

  before( async () => {
    token = await cadastrarUsuario(login.name, login.email, login.password)
  })

  describe('GET /api/users/profile', () => {
    it('StatusCode 200 - Deve retornar o perfil do usuário autenticado', async () => {
      const resposta = await request(baseUrl)
        .get('/api/users/profile')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)

      expect(resposta.status).to.equal(200)
      expect(resposta.body.user).to.have.property('name')
      expect(resposta.body.user).to.have.property('email')
      expect(resposta.body.user).to.have.property('createdAt')
      expect(resposta.body.user).to.have.property('isBlocked')
    })

    it('StatusCode 401 - Deve retornar um erro quando o usuário não estiver autenticado', async () => {
      const resposta = await request(baseUrl)
        .get('/api/users/profile')
        .set('Content-Type', 'application/json')

      expect(resposta.status).to.equal(401)
    })

    it('StatusCode 401 - Deve retornar um erro quando o token for inválido', async () => {
      const resposta = await request(baseUrl)
        .get('/api/users/profile')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}123`)

      expect(resposta.status).to.equal(401)
    })
    })

    describe('PUT /api/users/profile', () => {
      it('StatusCode 200 - Deve atualizar o perfil do usuário se tiver token válido', async () => {
        const resposta = await request(baseUrl)
        .put('/api/users/profile')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({name : 'Clebinho Junior'})
  
        expect(resposta.status).to.equal(200)
      })

      it('StatusCode 401 - Deve retornar erro quando usuário não estiver autenticado', async () => {
        const resposta = await request(baseUrl)
        .put('/api/users/profile')
        .set('Content-Type', 'application/json')
        .send({name : 'Clebinho Junior'})

        expect(resposta.status).to.equal(401)
      })
    })

    describe('DELETE /api/users/delete', () => {
      it('StatusCode 200 - Deve deletar o usuário quando estiver autenticado', async () => {
        const resposta = await request(baseUrl)
        .delete('/api/users/delete')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)

        expect(resposta.status).to.equal(200)
        expect(resposta.body).to.have.property('message')
      })

      it('StatusCode 401 - Deve retornar um erro quando o usuário não estiver autenticado', async () => {
        const resposta = await request(baseUrl)
        .delete('/api/users/delete')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}123`)

        expect(resposta.status).to.equal(401)
        expect(resposta.body).to.have.property('message')
      })
    })
  })