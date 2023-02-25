class OneComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, content, date, username } = payload;

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
    }

    _verifyPayload({ id, content, date, username }) {
        if (!id || !content || !date || !username) {
            throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof content !== 'string' || typeof date !== 'object' || typeof username !== 'string') {
            throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = OneComment;
