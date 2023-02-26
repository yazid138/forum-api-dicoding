/* istanbul ignore file */
const CreateReplyComment = require('../CreateReplyComment');

describe('a CreateReplyComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      userId: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateReplyComment(payload)).toThrowError('CREATE_REPLY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 123,
      userId: 'user-123',
    };

    // Action and Assert
    expect(() => new CreateReplyComment(payload)).toThrowError('CREATE_REPLY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreateReplyComment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'content',
      userId: 'user-123',
    };

    // Action
    const { commentId, content, userId } = new CreateReplyComment(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
  });
});
