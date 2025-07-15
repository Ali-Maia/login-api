const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API REST de Login',
      version: '1.0.0',
      description: 'API REST simples de login para estudos de teste de software',
      contact: {
        name: 'Desafio 3',
        email: 'contato@exemplo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerOptions; 