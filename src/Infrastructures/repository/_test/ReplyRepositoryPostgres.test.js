const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreateReplyComment = require('../../../Domains/replies/entities/CreateReplyComment');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');

describe('ReplyRepositoryPostgres', () => {
  let user = {};
  let thread = {};
  let comment = {};
  let reply = {};
  beforeAll(async () => {
    user = await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
      password: 'rahasia',
    });

    thread = await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'ini adalah judul',
      body: 'ini adalah body',
      userId: user.id,
    });

    comment = await CommentsTableTestHelper.addComment({
      id: 'comment-123',
      threadId: thread.id,
      userId: user.id,
      content: 'ini adalah komentar',
    });

    reply = await RepliesTableTestHelper.addReply({
      id: 'reply-123',
      commentId: comment.id,
      userId: user.id,
      content: 'ini adalah balasan komentar',
    });
  });

  afterAll(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('getAllRepliesByCommentsId function', () => {
    let replyRepositoryPostgres = null;
    beforeEach(() => {
      replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
    });

    it('should empty array when id not exists', async () => {
      // Action & Assert
      const replies = await replyRepositoryPostgres.getAllRepliesByCommentsId(['comment-xxx']);
      expect(replies).toHaveLength(0);
    });

    it('should not empty array when id available', async () => {
      const replies = await replyRepositoryPostgres.getAllRepliesByCommentsId([comment.id]);
      expect(replies).toHaveLength(1);
      expect(replies).toStrictEqual([{
        id: 'reply-123',
        username: 'dicoding',
        date: new Date('2023-03-07T17:00:00.000Z'),
        content: 'ini adalah balasan komentar',
        is_delete: false,
        user_id: user.id,
        thread_id: null,
        comment_id: comment.id
      }])
    });
  });

  describe('verifyUserId function', () => {
    let replyRepositoryPostgres = null;
    beforeEach(() => {
      replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
    });

    it('should throw AuthorizationError when user not allow', async () => {
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyUserId({ userId: 'user-xxx', replyId: reply.id })).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user allow', async () => {
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyUserId({ userId: user.id, replyId: reply.id })).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyReplyId function', () => {
    let replyRepositoryPostgres = null;
    beforeEach(() => {
      replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
    });

    it('should throw AuthorizationError when reply not exists', async () => {
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyId('reply-xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw AuthorizationError when reply exists', async () => {
      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyId(reply.id)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addReplyComment function', () => {
    let createReplyComment = null;
    beforeEach(() => {
      createReplyComment = new CreateReplyComment({
        commentId: comment.id,
        content: 'ini adalah komentar',
        userId: user.id,
      });
    });

    it('should create reply not correctly', async () => {
      const fakeIdGenerator = () => '000';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await expect(replyRepositoryPostgres.addReplyComment({})).rejects.toThrowError();
    });

    it('should persist add reply and return reply data correctly', async () => {
      const fakeIdGenerator = () => '111';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReplyComment(createReplyComment);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-111');
      expect(replies).toHaveLength(1);
    });

    it('should return created reply correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '222'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdreplyComment = await replyRepositoryPostgres.addReplyComment(createReplyComment);

      expect(createdreplyComment).toStrictEqual(new CreatedComment({
        id: 'reply-222', 
        content: createReplyComment.content, 
        user_id: user.id
      }))
      expect(createdreplyComment.id).toEqual('reply-222');
      expect(createdreplyComment.owner).toEqual(createReplyComment.userId);
    });
  });

  describe('removeReplyComment function', () => {
    let reply = {};
    let replyRepositoryPostgres = null;
    beforeAll(async () => {
      reply = await RepliesTableTestHelper.addReply({
        id: 'reply-333',
        commentId: comment.id,
        userId: user.id,
        content: 'ini adalah balasan komentar',
      });

      replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
    });

    it('should if empty params', async () => {
      // Action & Assert
      await expect(replyRepositoryPostgres.removeReplyComment()).rejects.toThrowError();
    });

    it('should throw InvariantError remove reply', async () => {
      // Action & Assert
      await expect(replyRepositoryPostgres.removeReplyComment('xxx')).rejects.toThrowError(InvariantError);
    });

    it('should remove reply correctly', async () => {
      await expect(replyRepositoryPostgres.removeReplyComment(reply.id)).resolves.not.toThrowError(InvariantError);

      // Action & Assert
      const removeReply = await RepliesTableTestHelper.findRepliesById(reply.id);

      expect(removeReply).toHaveLength(1);
      expect(removeReply[0].is_delete).toEqual(true);
    });
  });
});
