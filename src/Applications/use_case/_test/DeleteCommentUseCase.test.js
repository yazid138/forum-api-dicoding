const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.removeComment = jest.fn().mockImplementation(() => Promise.resolve(1));

    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const deletedComment = await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(deletedComment).toEqual(1)
    
    expect(mockThreadRepository.verifyThreadId)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.removeComment)
      .toHaveBeenCalledWith(useCasePayload);
  });
});
