// FollowRepository: Encapsula el acceso a datos de follows
const Follow = require('../models/follow');


class FollowRepository {
    async create(followData) {
        const follow = new Follow(followData);
        return await follow.save();
    }

    async findById(id) {
        return await Follow.findById(id);
    }

    async find(query = {}, page = null, itemsPerPage = null, populateField = null) {
        let q = Follow.find(query);
        if (populateField) q = q.populate(populateField);
        if (page && itemsPerPage) {
            q = q.skip((page - 1) * itemsPerPage).limit(itemsPerPage);
        }
        return await q.exec();
    }

    async count(query = {}) {
        return await Follow.countDocuments(query);
    }

    async delete(id) {
        return await Follow.findByIdAndDelete(id);
    }

    async deleteMany(query = {}) {
        return await Follow.deleteMany(query);
    }
}

module.exports = new FollowRepository();
