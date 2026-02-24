// MessageService: Lógica de negocio para mensajes
const messageRepository = require('../repositories/messageRepository');


class MessageService {
    async createMessage(data) {
        return await messageRepository.create(data);
    }

    async getMessageById(id) {
        return await messageRepository.findById(id);
    }

    async getMessages(query, page, itemsPerPage, sort = null) {
        // Si se pasan page e itemsPerPage, hacer paginación
        return await messageRepository.find(query, page, itemsPerPage, sort);
    }

    async countMessages(query) {
        return await messageRepository.count(query);
    }

    async updateMessages(filter, updateData) {
        return await messageRepository.updateMany(filter, updateData);
    }

    async updateMessage(id, data) {
        return await messageRepository.update(id, data);
    }

    async deleteMessage(id) {
        return await messageRepository.delete(id);
    }
}

module.exports = new MessageService();
