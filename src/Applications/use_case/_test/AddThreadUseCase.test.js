const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddThreadUseCase = require('../AddThreadUseCase')
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread')
const CreateThread = require('../../../Domains/threads/entities/CreateThread')

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'ini adalah title',
            body: 'ini adalah body',
            userId: 'user-123',
        }

        const mockCreatedThread = new CreatedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            user_id: useCasePayload.userId,
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository()

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockCreatedThread))

        /** creating use case instance */
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository
        })

        // Action
        const createdThread = await addThreadUseCase.execute(useCasePayload);

        // Assert
        expect(createdThread).toStrictEqual(new CreatedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            user_id: useCasePayload.userId,
        }));

        expect(mockThreadRepository.addThread).toBeCalledWith(new CreateThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            userId: useCasePayload.userId,
        }));
    })
})