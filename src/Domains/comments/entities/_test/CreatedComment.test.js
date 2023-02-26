/* istanbul ignore file */
const CreatedComment = require('../CreatedComment');

describe('a CreatedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'tes',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'tes',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new CreatedComment(payload)).toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'tes',
      user_id: 'user-123',
    };

    // Action
    const { id, content, owner } = new CreatedComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.user_id);
  });
});
