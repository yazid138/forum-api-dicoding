const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const CreatedComment = require('../../Domains/comments/entities/CreatedComment');

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async verifyUserId({ userId, commentId, threadId }) {
        const query = {
            text: 'SELECT id FROM comments WHERE user_id = $1 AND id = $2 AND thread_id = $3',
            values: [userId, commentId, threadId],
        };

        const { rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new AuthorizationError('user dilarang');
        }
    }

    async verifyCommentId(id) {
        const query = {
            text: 'SELECT id FROM comments WHERE id = $1',
            values: [id],
        };

        const { rowCount } = await this._pool.query(query);

        if (!rowCount) {
            throw new NotFoundError('comment_id tidak ada');
        }
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

    async removeComment(deleteComment) {
        const { commentId } = deleteComment
        await this.verifyCommentId(commentId)
        await this.verifyUserId(deleteComment);
        const query = {
            text: 'DELETE FROM comments WHERE id = $1 RETURNING id',
            values: [commentId],
        }

        return (await this._pool.query(query)).rowCount;
    }
}

module.exports = CommentRepositoryPostgres;
