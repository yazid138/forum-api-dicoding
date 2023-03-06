const OneReply = require('../../Domains/replies/entities/OneReply')
const OneComment = require('../../Domains/comments/entities/OneComment')
const OneThread = require('../../Domains/threads/entities/OneThread')

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadId(useCasePayload);
    const thread = new OneThread(await this._threadRepository.getThreadById(useCasePayload));
    const comments = await this._commentRepository.getAllCommentsByThreadId(thread.id);
    const replies = await this._replyRepository.getAllRepliesByCommentsId(comments.map((e) => e.id));
    thread.comments = comments.map(e => ({
      ...new OneComment(e),
      replies: replies.filter(e2 => e2.comment_id === e.id)
        .map(e2 => new OneReply(e2))
    }));
    return thread;
  }
}

module.exports = GetThreadUseCase;
