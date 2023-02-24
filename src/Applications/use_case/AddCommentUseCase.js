const CreateComment = require('../../Domains/comments/entities/CreateComment')

class AddCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadId } = useCasePayload
        await this._threadRepository.verifyThreadId(threadId);
        const createComment = new CreateComment(useCasePayload);
        return this._commentRepository.addComment(createComment);
    }
}

module.exports = AddCommentUseCase;
