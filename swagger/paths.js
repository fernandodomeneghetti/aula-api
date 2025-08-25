const paths = {
  '/api/usuarios': {
    get: {
      summary: 'Retorna todos os usuários',
      tags: ['Usuários'],
      responses: {
        200: {
          description: 'Lista de usuários',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Usuario'
                }
              }
            }
          }
        }
      }
    },
    post: {
      summary: 'Cria um novo usuário',
      tags: ['Usuários'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                nome: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Usuário criado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Usuario'
              }
            }
          }
        }
      }
    }
  },
  '/api/usuarios/getById/{id}': {
    get: {
      summary: 'Retorna um usuário por ID',
      tags: ['Usuários'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer'
          }
        }
      ],
      responses: {
        200: {
          description: 'Usuário encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Usuario'
              }
            }
          }
        },
        404: {
          description: 'Usuário não encontrado'
        }
      }
    }
  },
  '/api/usuarios/{id}': {
    put: {
      summary: 'Atualiza um usuário',
      tags: ['Usuários'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer'
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                nome: {
                  type: 'string'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Usuário atualizado'
        },
        404: {
          description: 'Usuário não encontrado'
        }
      }
    },
    delete: {
      summary: 'Remove um usuário',
      tags: ['Usuários'],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'integer'
          }
        }
      ],
      responses: {
        204: {
          description: 'Usuário removido'
        }
      }
    }
  }
};

module.exports = paths;