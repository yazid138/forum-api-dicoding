class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    await this._threadRepository.verifyThreadId(threadId);
    return this._commentRepository.removeComment(useCasePayload);
  }
}

module.exports = DeleteCommentUseCase;
