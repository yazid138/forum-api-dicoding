const CreateThread = require('../../Domains/threads/entities/CreateThread');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(userId, useCasePayload) {
        const createThread = new CreateThread({ ...useCasePayload, userId });
        return this._threadRepository.addThread(createThread);
    }
}

module.exports = AddThreadUseCase;
