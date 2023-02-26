/* istanbul ignore file */
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');

describe('CommentRepositoryPostgres', () => {
  let user = {};
  let thread = {};
  let comment = {};
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
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('getAllCommentsByThreadId function', () => {
    let commentRepositoryPostgres = null;
    beforeEach(() => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, replyRepositoryPostgres);
    });

    it('should empty array when id not exists', async () => {
      // Action & Assert
      const comment = await commentRepositoryPostgres.getAllCommentsByThreadId('thread-xxx');
      expect(comment).toHaveLength(0);
    });

    it('should not empty array when id available', async () => {
      const comment = await commentRepositoryPostgres.getAllCommentsByThreadId(thread.id);
      expect(comment).toHaveLength(1);
    });

    it('should comments object correctly', async () => {
      const comment2 = await commentRepositoryPostgres.getAllCommentsByThreadId(thread.id);
      expect(comment2[0].id).toEqual(comment.id);
      expect(comment2[0].replies).toHaveLength(0);
    });
  });

  describe('verifyUserId function', () => {
    let commentRepositoryPostgres = null;
    beforeEach(() => {
      commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
    });

    it('should throw AuthorizationError when user not allow', async () => {
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyUserId({ userId: 'user-xxx', commentId: comment.id })).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user allow', async () => {
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyUserId({ userId: user.id, commentId: comment.id })).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('verifyCommentId function', () => {
    let commentRepositoryPostgres = null;
    beforeEach(() => {
      commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
    });

    it('should throw AuthorizationError when comment not exists', async () => {
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentId('comment-xxx')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw AuthorizationError when comment exists', async () => {
      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentId(comment.id)).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addComment function', () => {
    let createComment = null;
    beforeEach(() => {
      createComment = new CreateComment({
        threadId: thread.id,
        content: 'ini adalah komentar',
        userId: user.id,
      });
    });

    it('should create comment not correctly', async () => {
      const fakeIdGenerator = () => '000';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, {});

      // Action
      await expect(commentRepositoryPostgres.addComment({})).rejects.toThrowError();
    });

    it('should persist add comment and return comment data correctly', async () => {
      const fakeIdGenerator = () => '111';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator, {});

      // Action
      await commentRepositoryPostgres.addComment(createComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-111');
      expect(comments).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '222'; // stub!
      const threadRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const createdComment = await threadRepositoryPostgres.addComment(createComment);

      expect(createdComment.id).toEqual('comment-222');
      expect(createdComment.title).toEqual(createComment.title);
      expect(createdComment.owner).toEqual(user.id);
    });
  });

  describe('removeComment function', () => {
    let comment = {};
    let commentRepositoryPostgres = null;
    beforeAll(async () => {
      comment = await CommentsTableTestHelper.addComment({
        id: 'comment-333',
        threadId: thread.id,
        userId: user.id,
        content: 'ini adalah komentar',
      });

      commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {}, {});
    });

    it('should throw NotFoundError when comment id not exists', async () => {
      // Action & Assert
      await expect(commentRepositoryPostgres.removeComment({ commentId: 'comment-xxx', userId: user.id })).rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when user not allow', async () => {
      // Action & Assert
      await expect(commentRepositoryPostgres.removeComment({ commentId: comment.id, userId: 'user-xxx' })).rejects.toThrowError(AuthorizationError);
    });

    it('should remove comment correctly', async () => {
      // Action & Assert
      await commentRepositoryPostgres.removeComment({ commentId: comment.id, userId: user.id });

      const removeComment = await CommentsTableTestHelper.findCommentsById(comment.id);

      expect(removeComment).toHaveLength(1);
      expect(removeComment[0].content).toEqual('**komentar telah dihapus**');
    });
  });
});
