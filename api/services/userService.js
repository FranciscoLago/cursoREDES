// UserService: Lógica de negocio para usuarios
const userRepository = require('../repositories/userRepository');

class UserService {
    async createUser(data) {
        return await userRepository.create(data);
    }

    async getUserById(id) {
        return await userRepository.findById(id);
    }

    async getUsers(query = {}, projection = null) {
        return await userRepository.find(query, projection);
    }

    async getUser(query = {}, projection = null) {
        return await userRepository.findOne(query, projection);
    }

    async updateUser(id, data) {
        return await userRepository.update(id, data);
    }

    async deleteUser(id) {
        return await userRepository.delete(id);
    }

    async countUsers(query = {}) {
        return await userRepository.count(query);
    }
}

module.exports = new UserService();
