/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({
        id = 'reply-123', commentId, userId, content = 'ini adalah komentar',
    }) {
        const date = new Date('2023-03-08').toISOString()
        const query = {
            text: 'INSERT INTO comments(id, comment_id, content, user_id, date) VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, commentId, content, userId, date],
        };

        return (await pool.query(query)).rows[0];
    },

    async findRepliesById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = RepliesTableTestHelper;
