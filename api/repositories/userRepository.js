// UserRepository: Encapsula el acceso a datos de usuarios
const User = require('../models/user');

class UserRepository {
    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async findById(id) {
        return await User.findById(id);
    }

    async find(query = {}, projection = null) {
        return await User.find(query, projection);
    }

    async findOne(query = {}, projection = null) {
        return await User.findOne(query, projection);
    }

    async update(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await User.findByIdAndDelete(id);
    }

    async count(query = {}) {
        return await User.countDocuments(query);
    }
}

module.exports = new UserRepository();
