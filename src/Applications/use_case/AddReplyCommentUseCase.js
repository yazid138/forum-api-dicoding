const CreateReplyComment = require('../../Domains/replies/entities/CreateReplyComment')

class AddReplyCommentUseCase {
    constructor({ threadRepository, commentRepository, replyRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId } = useCasePayload
        await this._threadRepository.verifyThreadId(threadId);
        await this._commentRepository.verifyCommentId(commentId);
        const createReplyComment = new CreateReplyComment(useCasePayload);
        return this._replyRepository.addReplyComment(createReplyComment);
    }
}

module.exports = AddReplyCommentUseCase;
