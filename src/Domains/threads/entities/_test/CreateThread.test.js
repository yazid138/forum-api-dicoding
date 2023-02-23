const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'abc',
            body: 'abc',
        };

        // Action and Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 123,
            body: true,
            userId: 'user-123',
        };

        // Action and Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when username contains more than 50 character', () => {
        // Arrange
        const payload = {
            title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
            body: 'Dicoding Indonesia',
            userId: 'user-123',
        };

        // Action and Assert
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.TITLE_LIMIT_CHAR');
    });

    it('should create registerUser object correctly', () => {
        // Arrange
        const payload = {
            title: 'dicoding',
            body: 'Dicoding Indonesia',
            userId: 'user-123',
        };

        // Action
        const { username, fullname, password } = new CreateThread(payload);

        // Assert
        expect(username).toEqual(payload.username);
        expect(fullname).toEqual(payload.fullname);
        expect(password).toEqual(payload.password);
    });
});
