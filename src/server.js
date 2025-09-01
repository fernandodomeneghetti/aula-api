const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('../docs/extends');
require('./config/database');

const app = express();
const PORT = 3001;

const specs = swaggerJsdoc(swaggerOptions);

app.use(express.json());

// Rotas
app.use('/api/users', require('./controllers/userController'));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação: http://localhost:${PORT}/api-docs`);
});