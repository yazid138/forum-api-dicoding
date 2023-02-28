const CreatedThread = require('../CreatedThread');

describe('a CreatedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
      id: 'thread-123',
    };

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      id: 'thread-123',
      user_id: 'user-123',
    };

    // Action and Assert
    expect(() => new CreatedThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CreatedThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      id: 'thread-123',
      user_id: 'user-123',
    };

    // Action
    const { title, id, owner } = new CreatedThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.user_id);
  });
});
