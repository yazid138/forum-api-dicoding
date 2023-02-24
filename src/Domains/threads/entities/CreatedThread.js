class CreatedThread {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, title, user_id } = payload;

        this.id = id;
        this.title = title;
        this.owner = user_id;
    }

    _verifyPayload({ title, id, user_id }) {
        if (!title || !id || !user_id) {
            throw new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof id !== 'string' || typeof user_id !== 'string') {
            throw new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CreatedThread;
