class DeleteReplyCommentUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId, commentId, replyId, userId,
    } = useCasePayload;
    await this._threadRepository.verifyThreadId(threadId);
    await this._commentRepository.verifyCommentId(commentId);
    await this._replyRepository.verifyReplyId(replyId);
    await this._replyRepository.verifyUserId({ userId, replyId });
    return this._replyRepository.removeReplyComment(replyId);
  }
}

module.exports = DeleteReplyCommentUseCase;
