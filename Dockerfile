# Usar imagem oficial do Node.js
FROM node:22-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm i

# Copiar código da aplicação
COPY . .

# Expor porta da aplicação
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "src/server.js"]