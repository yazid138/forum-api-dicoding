class OneComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username, is_delete
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({
    id, content, date, username, is_delete
  }) {
    if (!id || !content || !date || !username || is_delete === null) {
      throw new Error('ONE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'object' || typeof username !== 'string' || typeof is_delete !== 'boolean') {
      throw new Error('ONE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = OneComment;
