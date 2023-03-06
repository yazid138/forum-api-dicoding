const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const OneReply = require('../../Domains/replies/entities/OneReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getAllRepliesByCommentsId(commentsId) {
    const query = {
      text: 'SELECT a.*, b.username FROM comments a JOIN users b ON a.user_id = b.id WHERE a.comment_id = ANY($1::text[]) ORDER BY a.date ASC',
      values: [commentsId],
    };

    return (await this._pool.query(query)).rows;
  }

  async verifyUserId({ userId, replyId }) {
    const query = {
      text: 'SELECT id FROM comments WHERE user_id = $1 AND id = $2',
      values: [userId, replyId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new AuthorizationError('user dilarang');
  }

  async verifyReplyId(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('reply_id tidak ada');
  }

  async addReplyComment({ userId, commentId, content }) {
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments(id, comment_id, user_id, content, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, user_id',
      values: [id, commentId, userId, content, date],
    };

    return new CreatedComment((await this._pool.query(query)).rows[0]);
  }

  async removeReplyComment(replyId) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [true, replyId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new InvariantError('gagal menghapus balasan komentar');
  }
}

module.exports = ReplyRepositoryPostgres;
