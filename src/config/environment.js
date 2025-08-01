require('dotenv').config()

const requiredEnvVars = ['BASE_URL']

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente obrigatória não encontrada: ${envVar}`)
  }
})

module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
}