class CreateComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, content, userId } = payload;

    this.threadId = threadId;
    this.content = content;
    this.userId = userId;
  }

  _verifyPayload({ threadId, content, userId }) {
    if (!threadId || !content || !userId) {
      throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof content !== 'string' || typeof userId !== 'string') {
      throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateComment;
