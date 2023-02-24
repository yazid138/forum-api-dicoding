const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('verify Thread Id function', () => {
        it('should throw InvariantError when id not available', async () => {
            // Arrange
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'password',
                fullname: 'Dicoding'
            });
            const fakeIdGenerator = () => '123';
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
            const user = await userRepositoryPostgres.addUser(registerUser);

            await ThreadsTableTestHelper.addThread({
                userId: user.id,
                id: 'thread-123'
            })
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadId('thread-123')).rejects.toThrowError(InvariantError);
        });

        it('should not throw InvariantError when id available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(threadRepositoryPostgres.verifyThreadId('thread-123')).resolves.not.toThrowError(InvariantError);
        });
    });

    describe('addThread function', () => {
        it('should persist add thread and return thread data correctly', async () => {
            // Arrange
            const fakeIdGenerator = () => '123'; // stub!
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'password',
                fullname: 'Dicoding'
            });
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
            const user = await userRepositoryPostgres.addUser(registerUser);
            const createThread = new CreateThread({
                title: 'dicoding',
                body: 'secret_password',
                userId: user.id,
            });
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await threadRepositoryPostgres.addThread(createThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
            expect(threads).toHaveLength(1);
        });

        it('should return registered user correctly', async () => {
            // Arrange
            const fakeIdGenerator = () => '111'; // stub!
            const registerUser = new RegisterUser({
                username: 'dicoding',
                password: 'password',
                fullname: 'Dicoding'
            });
            const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)
            const user = await userRepositoryPostgres.addUser(registerUser);
            const createThread = new CreateThread({
                userId: user.id,
                title: 'title',
                body: 'body',
            });
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const createdThread = await threadRepositoryPostgres.addThread(createThread);

            expect(createdThread.id).toEqual('thread-111')
            expect(createdThread.title).toEqual('title')
            expect(createdThread.user_id).toEqual('user-111')
        });
    });
});
