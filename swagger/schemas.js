const schemas = {
  Usuario: {
    type: 'object',
    required: ['id', 'nome'],
    properties: {
      id: {
        type: 'integer',
        description: 'ID único do usuário'
      },
      nome: {
        type: 'string',
        description: 'Nome do usuário'
      }
    },
    example: {
      id: 1,
      nome: 'João'
    }
  }
};

module.exports = schemas;