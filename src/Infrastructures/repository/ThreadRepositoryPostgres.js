const InvariantError = require('../../Commons/exceptions/InvariantError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyAvailableId(id) {
        const query = {
            text: 'SELECT id FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (result.rowCount) {
            throw new InvariantError('threads tidak tersedia');
        }
    }

    async addThread(createThread) {
        const { userId, title, body } = createThread;
        const id = `thread-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads(id, title, body, user_id, date) VALUES($1, $2, $3, $4, $5) RETURNING id, title, user_id',
            values: [id, title, body, userId, date],
        };

        return (await this._pool.query(query)).rows[0];
    }
}

module.exports = ThreadRepositoryPostgres;
