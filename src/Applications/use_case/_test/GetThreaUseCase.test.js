const OneThread = require('../../../Domains/threads/entities/OneThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
    it('', async () => {
        const useCasePayload = 'thread-123';

        const mockThread = new OneThread({
            id: 'thread-123',
            title: 'title',
            body: 'body',
            date: new Date("2023-02-07"),
            username: 'dicoding',
        })

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()

        /** mocking needed function */
        mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(mockThread))

        const getThreadUseCase = new GetThreadUseCase({
            threadRepository: mockThreadRepository,
        })

        const threadData = await getThreadUseCase.execute(useCasePayload)

        // Assert
        expect(threadData).toStrictEqual(new OneThread({
            id: 'thread-123',
            title: 'title',
            body: 'body',
            date: new Date("2023-02-07"),
            username: 'dicoding',
        }))
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    })
})