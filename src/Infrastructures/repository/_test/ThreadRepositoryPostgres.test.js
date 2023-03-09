const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  let user = {};
  beforeAll(async () => {
    user = await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'rahasia',
    });
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('verifyThreadId function', () => {
    let threadRepositoryPostgres = null;
    beforeEach(() => {
      threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
    });

    it('should throw NotFoundError when thread id not exists', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'ini adalah judul',
        body: 'ini adalah body',
        userId: user.id,
      });

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadId('thread-xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread id exists', async () => {
      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadId('thread-123')).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    let createThread = null;
    beforeEach(() => {
      createThread = new CreateThread({
        userId: user.id,
        title: 'title',
        body: 'body',
      });
    });

    it('should create thread not correctly', async () => {
      const fakeIdGenerator = () => '000';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await expect(threadRepositoryPostgres.addThread({})).rejects.toThrowError();
    });

    it('should persist add thread and return thread data correctly', async () => {
      const fakeIdGenerator = () => '111';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(createThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-111');
      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '222'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(createThread);

      expect(createdThread).toStrictEqual(new CreatedThread({
        id: 'thread-222',
        title: createThread.title,
        user_id: user.id
      }))
      expect(createdThread.id).toEqual('thread-222');
      expect(createdThread.title).toEqual(createThread.title);
      expect(createdThread.owner).toEqual(user.id);
    });
  });

  describe('getThreadById function', () => {
    let payload = {};
    let threadRepositoryPostgres = null;
    beforeAll(async () => {
      payload = {
        id: 'thread-333',
        title: 'ini adalah judul',
        body: 'ini adalah body',
        userId: user.id,
      };

      await ThreadsTableTestHelper.addThread(payload);

      threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
    });

    it('should null when thread id not sent', async () => {
      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById()).resolves.toBeUndefined();
    });

    it('should thread object correctly', async () => {
      // Action & Assert
      const dataThread = await threadRepositoryPostgres.getThreadById('thread-333');

      expect(dataThread).toStrictEqual({
        id: 'thread-333',
        title: payload.title,
        body: payload.body,
        date: new Date(dataThread.date),
        user_id: 'user-123',
        username: 'dicoding'
      })
      expect(dataThread.id).toEqual('thread-333');
      expect(dataThread.title).toEqual(payload.title);
      expect(dataThread.body).toEqual(payload.body);
      expect(dataThread.date).toBeDefined();
      expect(dataThread.username).toEqual('dicoding');
    });
  });
});
