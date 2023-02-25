const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {

    let user = {};
    beforeAll(async () => {
        user = await UsersTableTestHelper.addUser({
            id: 'user-123',
            username: 'dicoding',
            fullname: 'Dicoding Indonesia',
            password: 'rahasia',
        })
    });

    afterAll(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('verifyThreadId function', () => {
        it('should throw NotFoundError when id not exists', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'ini adalah judul',
                body: 'ini adalah body',
                userId: user.id,
            })

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadId('thread-111')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw NotFoundError when id available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {}, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadId('thread-123')).resolves.not.toThrowError(NotFoundError);
        });
    });

    describe('addThread function', () => {
        it('should persist add thread and return thread data correctly', async () => {
            // Arrange
            const createThread = new CreateThread({
                title: 'dicoding',
                body: 'secret_password',
                userId: user.id,
            });
            const fakeIdGenerator = () => '111';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator, {});

            // Action
            await threadRepositoryPostgres.addThread(createThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadsById('thread-111');
            expect(threads).toHaveLength(1);
        });

        it('should return created thread correctly', async () => {
            // Arrange
            const fakeIdGenerator = () => '222'; // stub!
            const createThread = new CreateThread({
                userId: user.id,
                title: 'title',
                body: 'body',
            });
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const createdThread = await threadRepositoryPostgres.addThread(createThread);

            expect(createdThread.id).toEqual('thread-222')
            expect(createdThread.title).toEqual('title')
            expect(createdThread.owner).toEqual(user.id)
        });
    });
});
