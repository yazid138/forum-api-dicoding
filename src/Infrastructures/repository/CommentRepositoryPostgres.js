const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const OneComment = require('../../Domains/comments/entities/OneComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getAllCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT a.*, b.username FROM comments a JOIN users b ON a.user_id = b.id WHERE a.thread_id = $1 ORDER BY a.date ASC',
      values: [threadId],
    };

    return (await this._pool.query(query)).rows;
  }

  async verifyUserId({ userId, commentId }) {
    const query = {
      text: 'SELECT id FROM comments WHERE user_id = $1 AND id = $2',
      values: [userId, commentId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new AuthorizationError('user dilarang');
  }

  async verifyCommentId(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new NotFoundError('comment_id tidak ada');
  }

  async addComment({ userId, threadId, content }) {
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments(id, thread_id, user_id, content, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, user_id',
      values: [id, threadId, userId, content, date],
    };

    return new CreatedComment((await this._pool.query(query)).rows[0]);
  }

  async removeComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [true, commentId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) throw new InvariantError('gagal menghapus komentar');
  }
}

module.exports = CommentRepositoryPostgres;
