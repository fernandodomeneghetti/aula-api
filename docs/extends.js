const schemas = require('../swagger/schemas');
const paths = require('../swagger/paths');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuários',
      version: '1.0.0',
      description: 'API simples para gerenciar usuários'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    paths: paths,
    components: {
      schemas: schemas
    }
  },
  apis: []
};

module.exports = swaggerOptions;