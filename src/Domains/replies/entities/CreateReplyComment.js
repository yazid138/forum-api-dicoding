class CreateReplyComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { commentId, content, userId } = payload;

        this.commentId = commentId;
        this.content = content;
        this.userId = userId;
    }

    _verifyPayload({ commentId, content, userId }) {
        if (!commentId || !content || !userId) {
            throw new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof commentId !== 'string' || typeof content !== 'string' || typeof userId !== 'string') {
            throw new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CreateReplyComment;
