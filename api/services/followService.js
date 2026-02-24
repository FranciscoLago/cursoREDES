// FollowService: Lógica de negocio para follows
const followRepository = require('../repositories/followRepository');


class FollowService {
    async createFollow(data) {
        return await followRepository.create(data);
    }

    async getFollowById(id) {
        return await followRepository.findById(id);
    }

    async getFollows(query, page = null, itemsPerPage = null, populateField = null) {
        return await followRepository.find(query, page, itemsPerPage, populateField);
    }

    async countFollows(query) {
        return await followRepository.count(query);
    }

    async deleteFollow(id) {
        return await followRepository.delete(id);
    }

    async deleteFollows(query) {
        return await followRepository.deleteMany(query);
    }
}

module.exports = new FollowService();
