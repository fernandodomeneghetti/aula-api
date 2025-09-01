# Implementação de JWT e Autenticação

## 1. Instalação das Dependências

```bash
npm install jsonwebtoken bcryptjs
```

## 2. Configuração Inicial

Adicione no início do `index.js`:

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'sua_chave_secreta_aqui';

// Array para simular usuários com senha
let usuariosAuth = [
  { 
    id: 1, 
    nome: 'admin', 
    email: 'admin@teste.com',
    senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password
  }
];
```

## 3. Middleware de Autenticação

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};
```

## 4. Rotas de Autenticação

### Rota de Login
```javascript
app.post('/api/auth/login', async (req, res) => {
  const { email, senha } = req.body;
  
  const usuario = usuariosAuth.find(u => u.email === email);
  if (!usuario) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
});
```

### Rota de Registro
```javascript
app.post('/api/auth/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  
  const usuarioExiste = usuariosAuth.find(u => u.email === email);
  if (usuarioExiste) {
    return res.status(400).json({ message: 'Usuário já existe' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const novoUsuario = {
    id: usuariosAuth.length + 1,
    nome,
    email,
    senha: senhaHash
  };

  usuariosAuth.push(novoUsuario);
  res.status(201).json({ message: 'Usuário criado com sucesso' });
});
```

## 5. Protegendo as Rotas Existentes

Adicione o middleware nas rotas que precisam de autenticação:

```javascript
// Rotas protegidas
app.get('/api/usuarios', authenticateToken, (req, res) => {
  res.json(usuarios);
});

app.post('/api/usuarios', authenticateToken, (req, res) => {
  const novoUsuario = { id: usuarios.length + 1, ...req.body };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

app.put('/api/usuarios/:id', authenticateToken, (req, res) => {
  // código existente...
});

app.delete('/api/usuarios/:id', authenticateToken, (req, res) => {
  // código existente...
});
```

## 6. Documentação Swagger para JWT

### Configuração de Segurança no Swagger
```javascript
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuários com JWT',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./index.js']
};
```

### Documentação da Rota de Login
```javascript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Credenciais inválidas
 */
```

### Documentação da Rota de Registro
```javascript
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Usuário já existe
 */
```

## 7. Testando a Autenticação

### 1. Registrar usuário:
```bash
POST /api/auth/register
{
  "nome": "Teste",
  "email": "teste@teste.com",
  "senha": "123456"
}
```

### 2. Fazer login:
```bash
POST /api/auth/login
{
  "email": "admin@teste.com",
  "senha": "password"
}
```

### 3. Usar token nas rotas protegidas:
```bash
GET /api/usuarios
Authorization: Bearer SEU_TOKEN_AQUI
```

## 8. Configuração no Swagger UI

No Swagger UI, clique em "Authorize" e insira: `Bearer SEU_TOKEN`

## 9. Estrutura Final do package.json

```json
{
  "dependencies": {
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0"
  }
}
```