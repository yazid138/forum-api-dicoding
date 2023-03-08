class CommentLikeUseCase {
    constructor({ threadRepository, commentRepository, likeCommentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._likeCommentRepository = likeCommentRepository;
    }

    async execute(useCasePayload) {
        const { threadId, commentId, userId } = useCasePayload
        await this._threadRepository.verifyThreadId(threadId)
        await this._commentRepository.verifyCommentId(commentId)

        const likeComment = await this._likeCommentRepository.getLikeCommentId({ commentId, userId })
        if (likeComment) await this._likeCommentRepository.removeLike(likeComment.id)
        else await this._likeCommentRepository.addLike({ userId, commentId })
    }
}

module.exports = CommentLikeUseCase;
