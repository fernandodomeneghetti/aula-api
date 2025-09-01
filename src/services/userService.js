const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = 'vai-corinthians';

class UserService {
    async register(nome, email, senha) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(senha, 10);
        return await userRepository.create({
            nome,
            email,
            senha: hashedPassword
        });
    }

    async login(email, senha) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const isValidPassword = await bcrypt.compare(senha, user.senha);
        if (!isValidPassword) {
            throw new Error('Senha inválida');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { token, user: { id: user.id, nome: user.nome, email: user.email } };
    }

    async getAllUsers() {
        return await userRepository.findAll();
    }

    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        return user;
    }

    async updateUser(id, userData) {
        if (userData.senha) {
            userData.senha = await bcrypt.hash(userData.senha, 10);
        }
        return await userRepository.update(id, userData);
    }

    async deleteUser(id) {
        const deleted = await userRepository.delete(id);
        if (!deleted) {
            throw new Error('Usuário não encontrado');
        }
        return { message: 'Usuário deletado com sucesso' };
    }
}

module.exports = new UserService();