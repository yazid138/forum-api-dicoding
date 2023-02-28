class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadId(useCasePayload);
    const thread = await this._threadRepository.getThreadById(useCasePayload);
    let comments = await this._commentRepository.getAllCommentsByThreadId(thread.id);
    if (comments.length) comments = await Promise.all(comments.map(async (e) => ({ ...e, replies: await this._replyRepository.getAllRepliesByCommentId(e.id) })));
    return { ...thread, comments };
  }
}

module.exports = GetThreadUseCase;
