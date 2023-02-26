const CreateComment = require('../../Domains/comments/entities/CreateComment')

class AddCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = useCasePayload
        await this._threadRepository.verifyThreadId(threadId);
        return this._commentRepository.addComment(new CreateComment(useCasePayload));
    }
}

module.exports = AddCommentUseCase;
