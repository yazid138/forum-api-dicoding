const { autoBind } = require('auto-bind2');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        autoBind(this)
    }

    async postThreadHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute(userId, request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedThread
            },
        });
        response.code(201);
        return response;
    }
}

module.exports = ThreadsHandler;