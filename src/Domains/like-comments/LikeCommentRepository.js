class LikeCommentRepository {
    async getLikeCommentId({ commentId, userId }) {
        throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async addLike({ userId, commentId }) {
        throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async removeLike(commentLikeId) {
        throw new Error('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = LikeCommentRepository;
