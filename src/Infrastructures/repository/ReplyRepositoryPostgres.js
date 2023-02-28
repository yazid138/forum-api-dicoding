const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const OneComment = require('../../Domains/comments/entities/OneComment');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getAllRepliesByCommentId(commentId) {
    const query = {
      text: 'SELECT a.id, a.date, CASE WHEN is_delete IS TRUE THEN $1 ELSE a.content END content, b.username FROM comments a JOIN users b ON a.user_id = b.id WHERE a.comment_id = $2 ORDER BY a.date ASC',
      values: ['**balasan telah dihapus**', commentId],
    };
    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) return [];

    return rows.map((e) => new OneComment(e));
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

    const { rows, rowCount } = await this._pool.query(query)

    if(!rowCount) throw new InvariantError("gagal menambah balasan komentar")

    return new CreatedComment(rows[0]);
  }

  async removeReplyComment(replyId) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [true, replyId],
    };

    const { rowCount } = await this._pool.query(query)

    if(!rowCount) throw new InvariantError("gagal menghapus balasan komentar")
  }
}

module.exports = ReplyRepositoryPostgres;
