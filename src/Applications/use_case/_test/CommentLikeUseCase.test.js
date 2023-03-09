const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeCommentRepository = require("../../../Domains/like-comments/LikeCommentRepository");
const CommentLikeUseCase = require("../CommentLikeUseCase");

describe('CommentLikeUseCase', () => {
    it('if removed likes', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            userId: 'user-123',
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeCommentRepository = new LikeCommentRepository();

        /** mocking needed function */
        mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve())
        mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve())
        mockLikeCommentRepository.getLikeCommentId = jest.fn(() => Promise.resolve({ id: 'like-123' }))
        mockLikeCommentRepository.removeLike = jest.fn(() => Promise.resolve())
        mockLikeCommentRepository.addLike = jest.fn(() => Promise.resolve())

        /** creating use case instance */
        const commentLikeUseCase = new CommentLikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeCommentRepository: mockLikeCommentRepository,
        });

        // Action
        await commentLikeUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload.threadId)
        expect(mockCommentRepository.verifyCommentId).toBeCalledWith(useCasePayload.commentId)
        expect(mockLikeCommentRepository.getLikeCommentId).toBeCalledWith({ userId: useCasePayload.userId, commentId: useCasePayload.commentId })
        expect(mockLikeCommentRepository.removeLike).toBeCalledWith('like-123')
    })

    it('if added likes', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            userId: 'user-123',
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeCommentRepository = new LikeCommentRepository();

        /** mocking needed function */
        mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve())
        mockCommentRepository.verifyCommentId = jest.fn(() => Promise.resolve())
        mockLikeCommentRepository.getLikeCommentId = jest.fn(() => Promise.resolve(undefined))
        mockLikeCommentRepository.removeLike = jest.fn(() => Promise.resolve())
        mockLikeCommentRepository.addLike = jest.fn(() => Promise.resolve())

        /** creating use case instance */
        const commentLikeUseCase = new CommentLikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeCommentRepository: mockLikeCommentRepository,
        });

        // Action
        await commentLikeUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload.threadId)
        expect(mockCommentRepository.verifyCommentId).toBeCalledWith(useCasePayload.commentId)
        expect(mockLikeCommentRepository.getLikeCommentId).toBeCalledWith({ userId: useCasePayload.userId, commentId: useCasePayload.commentId })
        expect(mockLikeCommentRepository.addLike).toBeCalledWith({ userId: useCasePayload.userId, commentId: useCasePayload.commentId })
    })
})