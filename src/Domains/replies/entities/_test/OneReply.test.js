const OneReply = require('../OneReply');

describe('a OneReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'content',
            username: 'dicoding',
            is_delete: false,
        };

        // Action and Assert
        expect(() => new OneReply(payload)).toThrowError('ONE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'content',
            date: '2022-07-02',
            username: 'dicoding',
            is_delete: false,
        };

        // Action and Assert
        expect(() => new OneReply(payload)).toThrowError('ONE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should OneReply object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'content',
            date: new Date(),
            username: 'dicoding',
            is_delete: false,
        };

        // Action
        const {
            content, date, id, username
        } = new OneReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(date).toEqual(payload.date);
        expect(id).toEqual(payload.id);
        expect(username).toEqual(payload.username);
    });

    it('should OneReply object correctly if is_delete true', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'content',
            date: new Date(),
            username: 'dicoding',
            is_delete: true,
        };

        // Action
        const {
            content, date, id, username
        } = new OneReply(payload);

        // Assert
        expect(content).toEqual('**balasan telah dihapus**');
        expect(date).toEqual(payload.date);
        expect(id).toEqual(payload.id);
        expect(username).toEqual(payload.username);
    });
});
