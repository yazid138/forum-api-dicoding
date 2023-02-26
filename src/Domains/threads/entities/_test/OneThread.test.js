/* istanbul ignore file */
const OneThread = require('../OneThread');

describe('a OneThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      body: 'ini adalah body',
      date: new Date(),
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new OneThread(payload)).toThrowError('ONE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      body: 'ini adalah body',
      title: 'ini adalah judul',
      date: '2022-02-07',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new OneThread(payload)).toThrowError('ONE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create OneThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      body: 'ini adalah body',
      title: 'ini adalah judul',
      date: new Date(),
      username: 'dicoding',
    };

    // Action
    const {
      body, date, id, title, username,
    } = new OneThread(payload);

    // Assert
    expect(body).toEqual(payload.body);
    expect(id).toEqual(payload.id);
    expect(date).toEqual(payload.date);
    expect(title).toEqual(payload.title);
    expect(username).toEqual(payload.username);
  });
});
