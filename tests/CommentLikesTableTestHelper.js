/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
    async addLikeComment({
        id = 'like-123', commentId, userId,
    }) {
        const date = new Date('2023-03-08').toISOString()
        const query = {
            text: 'INSERT INTO comment_likes(id, comment_id, user_id, date) VALUES($1, $2, $3, $4) RETURNING id',
            values: [id, commentId, userId, date],
        };

        return (await pool.query(query)).rows[0];
    },

    async findLikeCommentsById(id) {
        const query = {
            text: 'SELECT * FROM comment_likes WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM comment_likes WHERE 1=1');
    },
};

module.exports = CommentLikesTableTestHelper;
