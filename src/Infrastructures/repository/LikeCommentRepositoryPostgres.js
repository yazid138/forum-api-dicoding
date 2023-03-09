const InvariantError = require('../../Commons/exceptions/InvariantError');
const LikeCommentRepository = require('../../Domains/like-comments/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async getLikeCommentId({ commentId, userId }) {
        const query = {
            text: 'SELECT id FROM comment_likes WHERE user_id = $1 AND comment_id = $2',
            values: [userId, commentId],
        };

        return (await this._pool.query(query)).rows[0];
    }

    async addLike({ userId, commentId }) {
        const id = `like-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comment_likes(id, comment_id, user_id) VALUES($1, $2, $3)',
            values: [id, commentId, userId],
        };

        await this._pool.query(query);
    }

    async removeLike(commentLikeId) {
        const query = {
            text: 'DELETE FROM comment_likes WHERE id = $1',
            values: [commentLikeId],
        };

        const { rowCount } = await this._pool.query(query);

        if (!rowCount) throw new InvariantError('gagal menghapus suka komentar');
    }
}

module.exports = LikeCommentRepositoryPostgres;
