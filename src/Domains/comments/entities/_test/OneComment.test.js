const OneComment = require('../OneComment');

describe('a OneComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      username: 'dicoding',
      is_delete: false,
    };

    // Action and Assert
    expect(() => new OneComment(payload)).toThrowError('ONE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      date: '2022-07-02',
      username: 'dicoding',
      is_delete: false,
    };

    // Action and Assert
    expect(() => new OneComment(payload)).toThrowError('ONE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should OneComment object correctly if is_delete false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      date: new Date(),
      username: 'dicoding',
      is_delete: false,
    };

    // Action
    const {
      content, date, id, username,
    } = new OneComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.date);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
  });

  it('should OneComment object correctly if is_delete true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      date: new Date(),
      username: 'dicoding',
      is_delete: true,
    };

    // Action
    const {
      content, date, id, username,
    } = new OneComment(payload);

    // Assert
    expect(content).toEqual('**komentar telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
  });
});
