# Plano de Aula: API em Camadas com Sequelize e JWT

## 1. Objetivos da Aula
- Organizar API em arquitetura de camadas
- Implementar autenticação JWT
- Integrar Sequelize ORM
- Configurar Swagger com autenticação

## 2. Estrutura do Projeto

### Arquitetura em Camadas
```
src/
├── config/          # Configurações (database.js)
├── controllers/     # Controladores HTTP
├── middleware/      # Middlewares (auth.js)
├── models/          # Modelos Sequelize
├── repositories/    # Acesso a dados
├── services/        # Lógica de negócio
└── server.js        # Servidor principal
```

### Responsabilidades
- **Controllers**: Recebem requisições e delegam para services
- **Services**: Contêm regras de negócio
- **Repositories**: Operações de banco de dados
- **Models**: Definição das entidades
- **Middleware**: Interceptadores (auth, validação)

## 3. Implementação Passo a Passo

### Passo 1: Configuração do Banco
- Arquivo: `src/config/database.js`
- Configuração do Sequelize com SQLite
- Autenticação e sincronização automática

### Passo 2: Modelo de Dados
- Arquivo: `src/models/User.js`
- Definição da entidade User com Sequelize
- Campos: id, nome, email, senha

### Passo 3: Repository Pattern
- Arquivo: `src/repositories/userRepository.js`
- Operações CRUD encapsuladas
- Exclusão de campos sensíveis nas consultas

### Passo 4: Camada de Serviço
- Arquivo: `src/services/userService.js`
- Lógica de negócio (validações, criptografia)
- Geração e validação de JWT

### Passo 5: Middleware de Autenticação
- Arquivo: `src/middleware/auth.js`
- Validação de tokens JWT
- Proteção de rotas

### Passo 6: Controllers
- Arquivo: `src/controllers/userController.js`
- Rotas HTTP com documentação Swagger
- Tratamento de erros

### Passo 7: Servidor Principal
- Arquivo: `src/server.js`
- Configuração do Express
- Integração das rotas e Swagger

## 4. Funcionalidades Implementadas

### Autenticação
- `POST /api/users/register` - Registro de usuário
- `POST /api/users/login` - Login com JWT

### CRUD de Usuários (Protegido)
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

## 5. Swagger com JWT

### Configuração de Segurança
```javascript
components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  }
}
```

### Uso nas Rotas
```javascript
/**
 * @swagger
 * /api/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 */
```

## 6. Como Testar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor
```bash
npm start
```

### 3. Acessar Documentação
- URL: http://localhost:3000/api-docs
- Testar registro e login
- Copiar token JWT
- Usar "Authorize" no Swagger

### 4. Fluxo de Teste
1. Registrar usuário em `/register`
2. Fazer login em `/login`
3. Copiar o token retornado
4. Clicar em "Authorize" no Swagger
5. Inserir: `Bearer {seu_token}`
6. Testar rotas protegidas

## 7. Conceitos Importantes

### JWT (JSON Web Token)
- Token stateless para autenticação
- Contém payload com dados do usuário
- Assinado com chave secreta

### Sequelize ORM
- Mapeamento objeto-relacional
- Abstração do banco de dados
- Migrations e validações automáticas

### Repository Pattern
- Separação entre lógica e acesso a dados
- Facilita testes unitários
- Reutilização de código

### Middleware
- Interceptadores de requisições
- Validação de autenticação
- Tratamento de erros

## 8. Exercícios Práticos

1. Adicionar validação de email único
2. Implementar refresh token
3. Criar middleware de validação de dados
4. Adicionar logs de auditoria
5. Implementar paginação na listagem

## 9. Próximos Passos

- Implementar testes unitários
- Adicionar validação com Joi/Yup
- Configurar variáveis de ambiente
- Implementar rate limiting
- Adicionar documentação de deploy