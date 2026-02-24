// MessageRepository: Encapsula el acceso a datos de mensajes
const Message = require('../models/message');


class MessageRepository {
    async create(messageData) {
        const message = new Message(messageData);
        return await message.save();
    }

    async findById(id) {
        return await Message.findById(id);
    }

    async find(query = {}, page = null, itemsPerPage = null, sort = null) {
        let q = Message.find(query).populate('emitter receiver', 'name surname _id nick image');
        if (sort) q = q.sort(sort);
        if (page && itemsPerPage) {
            q = q.skip((page - 1) * itemsPerPage).limit(itemsPerPage);
        }
        return await q.exec();
    }

    async count(query = {}) {
        return await Message.countDocuments(query);
    }

    async updateMany(filter, updateData) {
        return await Message.updateMany(filter, updateData, { multi: true });
    }

    async update(id, updateData) {
        return await Message.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await Message.findByIdAndDelete(id);
    }
}

module.exports = new MessageRepository();
