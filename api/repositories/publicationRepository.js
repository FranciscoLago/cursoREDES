// PublicationRepository: Encapsula el acceso a datos de publicaciones
const Publication = require('../models/publication');

class PublicationRepository {
    async create(publicationData) {
        const publication = new Publication(publicationData);
        return await publication.save();
    }

    async findById(id) {
        return await Publication.findById(id);
    }

    async find(query = {}, page = null, itemsPerPage = null, sort = null) {
        let q = Publication.find(query);
        if (sort) q = q.sort(sort);
        if (page && itemsPerPage) {
            q = q.skip((page - 1) * itemsPerPage).limit(itemsPerPage);
        }
        return await q.exec();
    }

    async count(query = {}) {
        return await Publication.countDocuments(query);
    }

    async update(id, updateData) {
        return await Publication.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(filter) {
        // Permite borrar por id o por filtro (user y _id)
        if (typeof filter === 'object' && filter !== null) {
            return await Publication.findOneAndDelete(filter);
        } else {
            return await Publication.findByIdAndDelete(filter);
        }
    }
}

module.exports = new PublicationRepository();
