# Estruturação de API em Camadas com Sequelize e JWT

## 📚 O que você vai aprender

Neste tutorial, você aprenderá a criar uma API profissional organizada em camadas, com autenticação JWT e banco de dados usando Sequelize. Mesmo sem conhecimento prévio, você conseguirá seguir todos os passos.

## 🎯 Conceitos Básicos (Para Iniciantes)

### O que é uma API?
Uma API (Interface de Programação de Aplicações) é como um garçom em um restaurante: você faz um pedido (requisição), ele leva para a cozinha (servidor) e traz sua comida (resposta).

### O que é JWT?
JWT é como um crachá de identificação digital. Quando você faz login, recebe um "crachá" que prova quem você é para acessar áreas restritas.

### O que é Sequelize?
Sequelize é um tradutor que converte comandos JavaScript em linguagem de banco de dados, facilitando muito o trabalho.

### Arquitetura em Camadas
Imagine uma empresa com departamentos:
- **Controller**: Recepção (recebe pedidos)
- **Service**: Gerência (toma decisões)
- **Repository**: Arquivo (busca/guarda dados)
- **Model**: Formulário padrão (estrutura dos dados)

## 🛠️ Pré-requisitos

1. **Node.js instalado** (versão 14 ou superior)
2. **Editor de código** (VS Code recomendado)
3. **Terminal/Prompt de comando**

### Como verificar se tem Node.js:
```bash
node --version
```
Se não aparecer a versão, baixe em: https://nodejs.org

## 📁 Passo 1: Criando a Estrutura do Projeto

### 1.1 Criar pasta do projeto
```bash
mkdir minha-api
cd minha-api
```

### 1.2 Inicializar projeto Node.js
```bash
npm init -y
```

### 1.3 Criar estrutura de pastas
```bash
mkdir src
mkdir src/config
mkdir src/controllers
mkdir src/middleware
mkdir src/models
mkdir src/repositories
mkdir src/services
mkdir docs
mkdir swagger
```

### 1.4 Estrutura final:
```
minha-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── services/
│   └── server.js
├── docs/
├── swagger/
└── package.json
```

## 📦 Passo 2: Instalando Dependências

### 2.1 Instalar todas as dependências necessárias:
```bash
npm install express sequelize sqlite3 bcryptjs jsonwebtoken swagger-jsdoc swagger-ui-express
```

### 2.2 O que cada dependência faz:
- **express**: Framework para criar a API
- **sequelize**: ORM para banco de dados
- **sqlite3**: Banco de dados simples
- **bcryptjs**: Criptografia de senhas
- **jsonwebtoken**: Criação de tokens JWT
- **swagger-jsdoc**: Documentação automática
- **swagger-ui-express**: Interface visual da documentação

## 🗄️ Passo 3: Configuração do Banco de Dados

### 3.1 Criar arquivo `src/config/database.js`:
```javascript
const { Sequelize } = require('sequelize');

// Configuração do banco SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',           // Tipo do banco
    storage: 'minha-api.sqlite', // Nome do arquivo
    logging: false               // Não mostrar logs SQL
});

// Testar conexão
sequelize.authenticate() 
    .then(() => {
        console.log('✅ Banco conectado com sucesso!');
        return sequelize.sync(); // Criar tabelas automaticamente
    })
    .catch(err => {
        console.error('❌ Erro na conexão:', err);
    });

module.exports = sequelize;
```

**Explicação simples**: Este arquivo configura a conexão com o banco de dados SQLite (um banco simples que não precisa de instalação).

## 👤 Passo 4: Criando o Model (Estrutura dos Dados)

### 4.1 Criar arquivo `src/models/User.js`:
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Definindo como será a tabela de usuários
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,        // Chave primária
        autoIncrement: true      // Incrementa automaticamente
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false         // Campo obrigatório
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true             // Email único
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = User;
```

**Explicação simples**: Este arquivo define como será a tabela de usuários no banco, como um formulário com campos obrigatórios.

## 🔐 Passo 5: Middleware de Autenticação

### 5.1 Criar arquivo `src/middleware/auth.js`:
```javascript
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'minha-chave-secreta-super-segura';

// Função que verifica se o usuário está logado
function authenticateToken(req, res, next) {
    // Pegar o token do cabeçalho da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // Se não tem token, não pode passar
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Verificar se o token é válido
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user; // Salvar dados do usuário na requisição
        next();          // Pode continuar
    });
}

module.exports = authenticateToken;
```

**Explicação simples**: Como um segurança que verifica seu crachá antes de deixar você entrar em uma área restrita.

## 🗃️ Passo 6: Repository (Acesso aos Dados)

### 6.1 Criar arquivo `src/repositories/userRepository.js`:
```javascript
const User = require('../models/User');

// Classe que faz todas as operações no banco
class UserRepository {
    // Criar novo usuário
    async create(userData) {
        return await User.create(userData);
    }

    // Buscar todos os usuários (sem mostrar a senha)
    async findAll() {
        return await User.findAll({
            attributes: { exclude: ['senha'] } // Não mostrar senha
        });
    }

    // Buscar usuário por ID (sem mostrar a senha)
    async findById(id) {
        return await User.findByPk(id, {
            attributes: { exclude: ['senha'] }
        });
    }

    // Buscar usuário por email (com senha, para login)
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    // Atualizar usuário
    async update(id, userData) {
        await User.update(userData, { where: { id } });
        return this.findById(id);
    }

    // Deletar usuário
    async delete(id) {
        return await User.destroy({ where: { id } });
    }
}

// Exportar uma instância da classe
module.exports = new UserRepository();
```

**Explicação simples**: Como um arquivista que sabe exatamente onde encontrar, guardar ou modificar documentos.

## 🏢 Passo 7: Service (Lógica de Negócio)

### 7.1 Criar arquivo `src/services/userService.js`:
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = 'minha-chave-secreta-super-segura';

// Classe com todas as regras de negócio
class UserService {
    // Registrar novo usuário
    async register(nome, email, senha) {
        // Verificar se email já existe
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(senha, 10);
        
        // Criar usuário no banco
        return await userRepository.create({
            nome,
            email,
            senha: hashedPassword
        });
    }

    // Fazer login
    async login(email, senha) {
        // Buscar usuário por email
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Verificar se a senha está correta
        const isValidPassword = await bcrypt.compare(senha, user.senha);
        if (!isValidPassword) {
            throw new Error('Senha inválida');
        }

        // Criar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Dados no token
            JWT_SECRET,                         // Chave secreta
            { expiresIn: '24h' }               // Expira em 24 horas
        );

        return { 
            token, 
            user: { id: user.id, nome: user.nome, email: user.email } 
        };
    }

    // Listar todos os usuários
    async getAllUsers() {
        return await userRepository.findAll();
    }

    // Buscar usuário por ID
    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        return user;
    }

    // Atualizar usuário
    async updateUser(id, userData) {
        // Se tem nova senha, criptografar
        if (userData.senha) {
            userData.senha = await bcrypt.hash(userData.senha, 10);
        }
        return await userRepository.update(id, userData);
    }

    // Deletar usuário
    async deleteUser(id) {
        const deleted = await userRepository.delete(id);
        if (!deleted) {
            throw new Error('Usuário não encontrado');
        }
        return { message: 'Usuário deletado com sucesso' };
    }
}

module.exports = new UserService();
```

**Explicação simples**: Como um gerente que toma todas as decisões importantes e aplica as regras da empresa.

## 🎮 Passo 8: Controller (Rotas da API)

### 8.1 Criar arquivo `src/controllers/userController.js`:
```javascript
const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authenticateToken = require('../middleware/auth');

// ROTA PÚBLICA: Registrar usuário
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const user = await userService.register(nome, email, senha);
        res.status(201).json({
            message: 'Usuário criado com sucesso!',
            user: { id: user.id, nome: user.nome, email: user.email }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ROTA PÚBLICA: Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const result = await userService.login(email, senha);
        res.json({
            message: 'Login realizado com sucesso!',
            token: result.token,
            user: result.user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ROTA PROTEGIDA: Listar usuários
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ROTA PROTEGIDA: Buscar usuário por ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// ROTA PROTEGIDA: Atualizar usuário
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json({
            message: 'Usuário atualizado com sucesso!',
            user
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ROTA PROTEGIDA: Deletar usuário
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
```

**Explicação simples**: Como uma recepcionista que recebe pedidos, encaminha para o departamento certo e dá a resposta de volta.

## 📋 Passo 9: Configuração do Swagger

### 9.1 Criar arquivo `docs/extends.js`:
```javascript
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API de Usuários',
      version: '1.0.0',
      description: 'API completa com autenticação JWT'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
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
  apis: ['./src/controllers/*.js']
};

module.exports = swaggerOptions;
```

## 🚀 Passo 10: Servidor Principal

### 10.1 Criar arquivo `src/server.js`:
```javascript
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('../docs/extends');

// Importar configuração do banco (isso conecta automaticamente)
require('./config/database');

const app = express();
const PORT = 3000;

// Configurar Swagger
const specs = swaggerJsdoc(swaggerOptions);

// Middleware para processar JSON
app.use(express.json());

// Rotas da API
app.use('/api/users', require('./controllers/userController'));

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rota inicial
app.get('/', (req, res) => {
    res.json({
        message: '🚀 API funcionando!',
        documentacao: 'http://localhost:3000/api-docs'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
});
```

## 📝 Passo 11: Configurar package.json

### 11.1 Editar arquivo `package.json`:
```json
{
  "name": "minha-api",
  "version": "1.0.0",
  "description": "API em camadas com JWT",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "sequelize": "^6.37.4",
    "sqlite3": "^5.1.7",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"
  }
}
```

## 🎯 Passo 12: Testando a API

### 12.1 Iniciar o servidor:
```bash
npm start
```

### 12.2 Acessar a documentação:
Abra no navegador: http://localhost:3000/api-docs

### 12.3 Fluxo de teste completo:

#### 1. Registrar um usuário:
- Método: POST
- URL: `/api/users/register`
- Body:
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

#### 2. Fazer login:
- Método: POST
- URL: `/api/users/login`
- Body:
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

#### 3. Copiar o token retornado

#### 4. Autorizar no Swagger:
- Clicar no botão "Authorize"
- Inserir: `Bearer SEU_TOKEN_AQUI`

#### 5. Testar rotas protegidas:
- GET `/api/users` - Listar usuários
- GET `/api/users/1` - Buscar por ID
- PUT `/api/users/1` - Atualizar
- DELETE `/api/users/1` - Deletar

## 🔧 Comandos Úteis

### Instalar dependências:
```bash
npm install
```

### Iniciar servidor:
```bash
npm start
```

### Verificar se está funcionando:
```bash
curl http://localhost:3000
```

## 🐛 Resolução de Problemas Comuns

### Erro: "Cannot find module"
**Solução**: Execute `npm install`

### Erro: "Port already in use"
**Solução**: Mude a porta no `server.js` ou mate o processo:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [número_do_processo] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Erro: "JWT malformed"
**Solução**: Certifique-se de usar o formato: `Bearer SEU_TOKEN`

### Banco não cria tabelas
**Solução**: Verifique se o arquivo `database.js` está sendo importado no `server.js`

## 📚 Conceitos Importantes Explicados

### 1. **Por que usar camadas?**
- **Organização**: Cada parte tem sua responsabilidade
- **Manutenção**: Fácil de encontrar e corrigir problemas
- **Reutilização**: Código pode ser usado em outros lugares
- **Testes**: Cada camada pode ser testada separadamente

### 2. **Como funciona o JWT?**
1. Usuário faz login com email/senha
2. Servidor verifica se está correto
3. Se sim, cria um token com dados do usuário
4. Token é enviado para o usuário
5. Usuário envia token em todas as próximas requisições
6. Servidor verifica token antes de permitir acesso

### 3. **Por que criptografar senhas?**
- **Segurança**: Se alguém acessar o banco, não verá senhas reais
- **Irreversível**: Não dá para "descriptografar", só comparar
- **Padrão**: É obrigatório em aplicações profissionais

### 4. **O que é o Sequelize?**
- **ORM**: Object-Relational Mapping (mapeamento objeto-relacional)
- **Tradução**: Converte objetos JavaScript em comandos SQL
- **Facilidade**: Não precisa escrever SQL manualmente
- **Portabilidade**: Funciona com vários bancos de dados

## 🎓 Exercícios para Praticar

### Nível Iniciante:
1. Adicionar campo "telefone" no modelo User
2. Criar rota para buscar usuário por email
3. Adicionar validação de email válido

### Nível Intermediário:
4. Implementar paginação na listagem de usuários
5. Adicionar logs de todas as operações
6. Criar middleware para validar dados de entrada

### Nível Avançado:
7. Implementar refresh token
8. Adicionar roles (admin, user)
9. Criar testes automatizados

## 🚀 Próximos Passos

Depois de dominar este tutorial, você pode:

1. **Aprender sobre testes**: Jest, Mocha
2. **Melhorar segurança**: Rate limiting, CORS
3. **Deploy**: Heroku, AWS, Docker
4. **Banco de dados**: PostgreSQL, MongoDB
5. **Frontend**: React, Vue.js para consumir sua API

## 📞 Suporte

Se tiver dúvidas:
1. Verifique se seguiu todos os passos
2. Confira se todas as dependências estão instaladas
3. Veja os logs de erro no terminal
4. Compare seu código com os exemplos

**Parabéns! 🎉 Você criou uma API profissional completa!**