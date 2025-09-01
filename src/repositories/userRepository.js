const User = require('../models/User');

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findAll() {
        return await User.findAll({
            attributes: { exclude: ['senha'] }
        });
    }

    async findById(id) {
        return await User.findByPk(id, {
            attributes: { exclude: ['senha'] }
        });
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async update(id, userData) {
        await User.update(userData, { where: { id } });
        return this.findById(id);
    }

    async delete(id) {
        return await User.destroy({ where: { id } });
    }
}

module.exports = new UserRepository();