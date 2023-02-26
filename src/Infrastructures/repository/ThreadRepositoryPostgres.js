const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const OneThread = require('../../Domains/threads/entities/OneThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator, commentRepository) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
    this._commentRepository = commentRepository;
  }

  async verifyThreadId(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('thread_id tidak ada');
    }
  }

  async addThread({ userId, title, body }) {
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads(id, title, body, user_id, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, user_id',
      values: [id, title, body, userId, date],
    };

    return new CreatedThread((await this._pool.query(query)).rows[0]);
  }

  async getThreadById(id) {
    await this.verifyThreadId(id);

    const query = {
      text: 'SELECT a.*, b.username FROM threads a JOIN users b ON a.user_id = b.id WHERE a.id = $1',
      values: [id],
    };
    const thread = new OneThread((await this._pool.query(query)).rows[0]);

    const comments = (await this._commentRepository.getAllCommentsByThreadId(thread.id));

    return { ...thread, comments };
  }
}

module.exports = ThreadRepositoryPostgres;
