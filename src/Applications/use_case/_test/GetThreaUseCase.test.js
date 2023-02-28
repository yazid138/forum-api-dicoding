const OneThread = require('../../../Domains/threads/entities/OneThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const OneComment = require('../../../Domains/comments/entities/OneComment');

describe('GetThreadUseCase', () => {
  it('', async () => {
    const useCasePayload = 'thread-123';

    const mockThread = new OneThread({
      id: useCasePayload,
      title: 'title',
      body: 'body',
      date: new Date('2023-02-07'),
      username: 'dicoding',
    });

    const mockReplies = [
      new OneComment({ id: 'reply-111', content: 'ini adalah balasan komentar', date: new Date('2023-02-08'), username: 'dicoding2' }),
      new OneComment({ id: 'reply-222', content: 'ini adalah balasan komentar', date: new Date('2023-02-09'), username: 'dicoding3' })
    ]

    const mockComments = [
      new OneComment({ id: 'comment-111', content: 'ini adalah komentar', date: new Date('2023-02-07'), username: 'dicoding' }),
      new OneComment({ id: 'comment-222', content: 'ini adalah komentar', date: new Date('2023-02-08'), username: 'dicoding2' })
    ]

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommenRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn().mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread));
    mockCommenRepository.getAllCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getAllRepliesByCommentId = jest.fn().mockImplementation((commentId) => Promise.resolve(commentId === 'comment-111' ? mockReplies : []));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommenRepository,
      replyRepository: mockReplyRepository,
    });

    const threadData = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(threadData).toStrictEqual({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: new Date('2023-02-07'),
      username: 'dicoding',
      comments: [
        {
          id: 'comment-111', content: 'ini adalah komentar', date: new Date('2023-02-07'), username: 'dicoding', replies: [
            new OneComment({ id: 'reply-111', content: 'ini adalah balasan komentar', date: new Date('2023-02-08'), username: 'dicoding2' }),
            new OneComment({ id: 'reply-222', content: 'ini adalah balasan komentar', date: new Date('2023-02-09'), username: 'dicoding3' })
          ]
        },
        {
          id: 'comment-222', content: 'ini adalah komentar', date: new Date('2023-02-08'), username: 'dicoding2', replies: []
        }
      ]
    });
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommenRepository.getAllCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getAllRepliesByCommentId).toBeCalledWith('comment-111')
  });
});
