class CreatedComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, content, user_id } = payload;

        this.id = id;
        this.content = content;
        this.owner = user_id;
    }

    _verifyPayload({ content, id, user_id }) {
        if (!content || !id || !user_id) {
            throw new Error('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof id !== 'string' || typeof user_id !== 'string') {
            throw new Error('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CreatedComment;
