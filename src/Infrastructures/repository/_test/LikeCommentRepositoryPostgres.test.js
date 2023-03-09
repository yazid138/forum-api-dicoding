const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('LikeCommentRepositoryPostgres', () => {
    let user = {};
    let thread = {};
    let comment = {};
    let comment2 = {};
    let commentLike = {};
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

        comment2 = await CommentsTableTestHelper.addComment({
            id: 'comment-234',
            threadId: thread.id,
            userId: user.id,
            content: 'ini adalah komentar',
        });

        commentLike = await CommentLikesTableTestHelper.addLikeComment({
            id: 'like-123',
            commentId: comment.id,
            userId: user.id,
        })
    });

    afterAll(async () => {
        await CommentLikesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('getLikeCommentId function', () => {
        let likeCommentRepository = null;
        beforeEach(async () => {
            likeCommentRepository = new LikeCommentRepositoryPostgres(pool, {});
        });

        it('correct', async () => {
            const likeCommentId = await likeCommentRepository.getLikeCommentId({ userId: user.id, commentId: comment.id })
            expect(likeCommentId).toStrictEqual({ id: 'like-123' });
        })

        it('not correct', async () => {
            const likeCommentId = await likeCommentRepository.getLikeCommentId({ userId: user.id, commentId: 'comment-xxx' })
            expect(likeCommentId).toBeUndefined();
        })
    })

    describe('addLike function', () => {
        it('succes add like', async () => {
            const fakeIdGenerator = () => '222';
            const likeCommentRepository = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);
            await expect(likeCommentRepository.addLike({ userId: user.id, commentId: comment2.id })).resolves.not.toThrowError(InvariantError)
            const commentLike = (await CommentLikesTableTestHelper.findLikeCommentsById('like-222'))[0];
            expect(commentLike.id).toEqual('like-222')
            expect(commentLike.user_id).toEqual(user.id)
            expect(commentLike.comment_id).toEqual(comment2.id)
        })
    })

    describe('removeLike function', () => {
        it('failed remove like', async () => {
            const likeCommentRepository = new LikeCommentRepositoryPostgres(pool, {});
            await expect(likeCommentRepository.removeLike('like-xxx')).rejects.toThrowError(InvariantError)
        })
        
        it('succes remove like', async () => {
            const likeCommentRepository = new LikeCommentRepositoryPostgres(pool, {});
            await expect(likeCommentRepository.removeLike('like-123')).resolves.not.toThrowError(InvariantError)
            const commentLike = (await CommentLikesTableTestHelper.findLikeCommentsById('like-123'));
            expect(commentLike).toHaveLength(0);
        })
    })
})