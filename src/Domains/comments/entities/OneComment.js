class OneComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, is_delete, likes
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.likeCount = +likes;
  }

  _verifyPayload({
    id, content, date, username, is_delete, likes
  }) {
    if (!id || !content || !date || !username || is_delete === null || likes === null) {
      throw new Error('ONE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'object' || typeof username !== 'string' || typeof is_delete !== 'boolean' || typeof +likes !== 'number') {
      throw new Error('ONE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = OneComment;
