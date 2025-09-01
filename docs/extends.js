const schemas = require('../swagger/schemas');
const paths = require('../swagger/paths');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuários',
      version: '1.0.0',
      description: 'API simples para gerenciar usuários com autenticação JWT'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desenvolvimento'
      }
    ],
    paths: paths,
    components: {
      schemas: schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/controllers/*.js']
};

module.exports = swaggerOptions;