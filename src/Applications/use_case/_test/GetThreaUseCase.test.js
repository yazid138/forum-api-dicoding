const OneThread = require('../../../Domains/threads/entities/OneThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const OneComment = require('../../../Domains/comments/entities/OneComment');
const OneReply = require('../../../Domains/replies/entities/OneReply');

describe('GetThreadUseCase', () => {
  it('if comments not empty', async () => {
    const useCasePayload = 'thread-123';

    const mockThread = new OneThread({
      id: useCasePayload,
      title: 'title',
      body: 'body',
      date: new Date('2023-02-07'),
      username: 'dicoding',
    });

    const mockReplies = [
      {
        id: 'reply-111', content: 'ini adalah balasan komentar', date: new Date('2023-02-08'), username: 'dicoding2', is_delete: true, comment_id: 'comment-111',
      },
      {
        id: 'reply-222', content: 'ini adalah balasan komentar', date: new Date('2023-02-09'), username: 'dicoding3', is_delete: false, comment_id: 'comment-111',
      },
    ];

    const mockComments = [
      {
        id: 'comment-111', content: 'ini adalah komentar', date: new Date('2023-02-07'), username: 'dicoding', is_delete: true, likes: 1
      },
      {
        id: 'comment-222', content: 'ini adalah komentar', date: new Date('2023-02-08'), username: 'dicoding2', is_delete: false, likes: 2
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThread));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));
    mockReplyRepository.getAllRepliesByCommentsId = jest.fn(() => Promise.resolve(mockReplies))

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadData = await getThreadUseCase.execute(useCasePayload);

    // Assert
    const expectData = new OneThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: new Date('2023-02-07'),
      username: 'dicoding',
    })
    expectData.comments = [
      {
        id: 'comment-111',
        content: '**komentar telah dihapus**',
        date: new Date('2023-02-07'),
        username: 'dicoding',
        likeCount: 1,
        replies: [
          new OneReply({
            id: 'reply-111', content: 'ini adalah balasan komentar', date: new Date('2023-02-08'), username: 'dicoding2', is_delete: true,
          }),
          new OneReply({
            id: 'reply-222', content: 'ini adalah balasan komentar', date: new Date('2023-02-09'), username: 'dicoding3', is_delete: false,
          }),
        ],
      },
      {
        id: 'comment-222',
        content: 'ini adalah komentar',
        date: new Date('2023-02-08'),
        username: 'dicoding2',
        likeCount: 2,
        replies: [],
      },
    ]
    expect(threadData).toStrictEqual(expectData);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getAllCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getAllRepliesByCommentsId).toBeCalledWith(mockComments.map(e => e.id));
  });

  it('if comments is empty', async () => {
    const useCasePayload = 'thread-123';

    const mockThread = new OneThread({
      id: useCasePayload,
      title: 'title',
      body: 'body',
      date: new Date('2023-02-07'),
      username: 'dicoding',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadId = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThread));
    mockCommentRepository.getAllCommentsByThreadId = jest.fn(() => Promise.resolve([]));
    mockReplyRepository.getAllRepliesByCommentsId = jest.fn(() => Promise.resolve([]))

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadData = await getThreadUseCase.execute(useCasePayload);

    // Assert
    const expectData = new OneThread({
      id: 'thread-123',
      title: 'title',
      body: 'body',
      date: new Date('2023-02-07'),
      username: 'dicoding',
    })
    expectData.comments = []
    expect(threadData).toStrictEqual(expectData);
    expect(mockThreadRepository.verifyThreadId).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getAllCommentsByThreadId).toBeCalledWith(useCasePayload);
    expect(mockReplyRepository.getAllRepliesByCommentsId).toBeCalledWith([]);
  });
});
