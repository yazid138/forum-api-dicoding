/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123', title = 'dicoding', body = 'ini adalah body', userId,
    }) {
        const date = new Date().toISOString()
        const query = {
            text: 'INSERT INTO threads(id, title, body, user_id, date) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, title, body, userId, date],
        };

        return (await pool.query(query)).rows[0];
    },

    async findThreadsById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    },
};

module.exports = ThreadsTableTestHelper;
