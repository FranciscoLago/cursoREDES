// PublicationService: Lógica de negocio para publicaciones
const publicationRepository = require('../repositories/publicationRepository');

class PublicationService {
    async createPublication(data) {
        return await publicationRepository.create(data);
    }

    async getPublicationById(id) {
        return await publicationRepository.findById(id);
    }

    async getPublications(query, page = null, itemsPerPage = null, sort = null) {
        return await publicationRepository.find(query, page, itemsPerPage, sort);
    }

    async countPublications(query) {
        return await publicationRepository.count(query);
    }

    async updatePublication(id, data) {
        return await publicationRepository.update(id, data);
    }

    async deletePublication(filter) {
        return await publicationRepository.delete(filter);
    }
}

module.exports = new PublicationService();
