/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({
        id = 'reply-123', commentId, userId, content = 'ini adalah komentar',
    }) {
        const date = new Date().toISOString()
        const query = {
            text: 'INSERT INTO replies(id, comment_id, content, user_id, date) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, commentId, content, userId, date],
        };

        return (await pool.query(query)).rows[0];
    },

    async findRepliesById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
    },
};

module.exports = RepliesTableTestHelper;
