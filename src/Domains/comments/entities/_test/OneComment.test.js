/* istanbul ignore file */
const OneComment = require('../OneComment');

describe('a OneComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      username: 'dicoding',
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
    };

    // Action and Assert
    expect(() => new OneComment(payload)).toThrowError('ONE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create OneComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'content',
      date: new Date(),
      username: 'dicoding',
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
});
