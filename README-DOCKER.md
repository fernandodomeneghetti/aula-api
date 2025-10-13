# Docker para APIs Node.js - Guia Completo

## 📚 O que é Docker?

Docker é uma plataforma de containerização que permite empacotar aplicações e suas dependências em containers leves e portáteis. Um container é uma unidade padronizada que inclui tudo necessário para executar uma aplicação: código, runtime, bibliotecas e configurações.

## 🎯 Conceitos Fundamentais

### Container vs Virtual Machine
- **Container**: Compartilha o kernel do SO host, mais leve e rápido
- **VM**: Possui SO completo próprio, mais pesada

### Componentes Principais
- **Image**: Template imutável para criar containers
- **Container**: Instância executável de uma image
- **Dockerfile**: Arquivo de instruções para construir uma image
- **Registry**: Repositório de images (Docker Hub, ECR, etc.)

## 🏗️ Implementação Prática

### 1. Criando o Dockerfile

```dockerfile
# Usar imagem oficial do Node.js
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Expor porta da aplicação
EXPOSE 3000

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
```

### 2. Criando .dockerignore

```
node_modules
npm-debug.log
.git
.gitignore
README*.md
.env
.nyc_output
coverage
.nyc_output
```

### 3. Construindo a Image

```bash
# Construir a image
docker build -t aula-api .

# Listar images
docker images
```

### 4. Executando o Container

```bash
# Executar container
docker run -p 3000:3000 --name api-container aula-api

# Executar em background
docker run -d -p 3000:3000 --name api-container aula-api

# Executar com variáveis de ambiente
docker run -p 3000:3000 -e NODE_ENV=production --name api-container aula-api
```

## 🔧 Docker Compose

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=sua_chave_secreta
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    
  # Exemplo com banco de dados
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=aula_api
      - POSTGRES_USER=api_user
      - POSTGRES_PASSWORD=api_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Comandos Docker Compose

```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em background
docker-compose up -d

# Parar serviços
docker-compose down

# Rebuild e restart
docker-compose up --build
```

## 🚀 Otimizações Avançadas

### Multi-stage Build

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Production
FROM node:18-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app .
USER nextjs
EXPOSE 3000
CMD ["node", "index.js"]
```

### Health Check

```dockerfile
# Adicionar ao Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

### Endpoint de Health Check na API

```javascript
// Adicionar ao index.js
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 📊 Monitoramento e Logs

### Visualizar Logs

```bash
# Ver logs do container
docker logs api-container

# Seguir logs em tempo real
docker logs -f api-container

# Ver logs com timestamp
docker logs -t api-container
```

### Monitoramento de Recursos

```bash
# Estatísticas em tempo real
docker stats api-container

# Informações detalhadas
docker inspect api-container
```

## 🔒 Boas Práticas de Segurança

### 1. Usuário Não-Root
```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs
```

### 2. Secrets Management
```bash
# Usar Docker Secrets
echo "minha_chave_secreta" | docker secret create jwt_secret -

# No docker-compose.yml
secrets:
  - jwt_secret
```

### 3. Scan de Vulnerabilidades
```bash
# Escanear image por vulnerabilidades
docker scout cves aula-api
```

## 🌐 Deploy em Produção

### 1. Registry Privado

```bash
# Tag da image
docker tag aula-api:latest seu-registry.com/aula-api:v1.0.0

# Push para registry
docker push seu-registry.com/aula-api:v1.0.0
```

### 2. Variáveis de Ambiente

```bash
# Arquivo .env para produção
NODE_ENV=production
JWT_SECRET=chave_super_secreta_producao              # Aqui pessoal, o legal é injetar esse valor em pipeline
DATABASE_URL=postgresql://user:pass@db:5432/aula_api # Aqui pessoal, o legal é injetar esse valor em pipeline
```

### 3. Reverse Proxy com Nginx

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api

  api:
    build: .
    expose:
      - "3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 🛠️ Comandos Úteis

```bash
# Gerenciamento de Containers
docker ps                    # Listar containers ativos
docker ps -a                 # Listar todos containers
docker stop api-container    # Parar container
docker start api-container   # Iniciar container
docker restart api-container # Reiniciar container
docker rm api-container      # Remover container

# Gerenciamento de Images
docker images               # Listar images
docker rmi aula-api        # Remover image
docker system prune        # Limpar recursos não utilizados

# Debug
docker exec -it api-container sh    # Acessar shell do container
docker exec api-container ls -la    # Executar comando no container
```

## 🎓 Conclusão

Docker revoluciona o desenvolvimento e deploy de APIs ao:
- **Padronizar** ambientes de desenvolvimento e produção
- **Simplificar** o processo de deploy
- **Isolar** aplicações e dependências
- **Escalar** horizontalmente com facilidade
- **Garantir** consistência entre ambientes

A containerização é essencial para arquiteturas modernas, microserviços e DevOps, proporcionando maior agilidade e confiabilidade no ciclo de vida das aplicações.