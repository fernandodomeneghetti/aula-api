const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./docs/extends');

const app = express();
const PORT = 3000;

const specs = swaggerJsdoc(swaggerOptions);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'vai-corinthians';


app.use(express.json());

let usuarios = [
  { id: 1, nome: "João" },
  { id: 2, nome: "Maria" }
];

app.get("/api/usuarios", (req, res) => {
  res.json(usuarios);
});

app.get("/api/usuarios/getById/:id", (req, res) => {
    const { id } = req.params;
    const index = usuarios.findIndex(u => u.id == id);
    if (index > -1) {
        res.json(usuarios[index]);
    } else {
        res.status(404).json({ message: "Usuário não encontrado" });    
    }
});

app.post("/api/usuarios", (req, res) => {
  const novoUsuario = { id: usuarios.length + 1, ...req.body };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

app.put("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const usuarioIndex = usuarios.findIndex(u => u.id == id);
  if (usuarioIndex > -1) {
    usuarios[usuarioIndex] = { id: Number(id), ...req.body };
    res.json(usuarios[usuarioIndex]);
  } else {
    res.status(404).json({ message: "Usuário não encontrado" });
  }
});

app.delete("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  usuarios = usuarios.filter(u => u.id != id);
  res.status(204).send();
});


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});