const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ReplyRepository = require('../../../Domains/replies/ReplyRepository')
const AddReplyCommentUseCase = require('../AddReplyCommentUseCase')
const CreateReplyComment = require('../../../Domains/replies/entities/CreateReplyComment')
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment')

describe('AddReplyCommentUseCase', () => {
    it('should orchestrating the add reply comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            content: 'content',
            userId: 'user-123',
        }

        const mockCreatedReply = new CreatedComment({
            id: 'reply-123',
            content: useCasePayload.content,
            user_id: useCasePayload.userId,
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()
        const mockCommentRepository = new CommentRepository()
        const mockReplyRepository = new ReplyRepository()

        /** mocking needed function */
        mockThreadRepository.verifyThreadId = jest.fn().mockImplementation(() => Promise.resolve())
        mockCommentRepository.verifyCommentId = jest.fn().mockImplementation(() => Promise.resolve())
        mockReplyRepository.addReplyComment = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedReply))

        /** creating use case instance */
        const addReplyCommentUseCase = new AddReplyCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        })

        // Action
        const createdReply = await addReplyCommentUseCase.execute(useCasePayload);

        // Assert
        expect(createdReply).toStrictEqual(new CreatedComment({
            id: 'reply-123',
            content: useCasePayload.content,
            user_id: useCasePayload.userId,
        }));

        expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentId).toBeCalledWith(useCasePayload.commentId);
        expect(mockReplyRepository.addReplyComment).toBeCalledWith(new CreateReplyComment({
            commentId: useCasePayload.commentId,
            content: useCasePayload.content,
            userId: useCasePayload.userId,
        }));
    })
})