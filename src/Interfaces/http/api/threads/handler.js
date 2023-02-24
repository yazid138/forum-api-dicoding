const { autoBind } = require('auto-bind2');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        autoBind(this)
    }

    async getThreadHandler(request, h) {
        const { id: threadId } = request.params;
        const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
        const thread = await getThreadUseCase.execute(threadId);

        return {
            status: 'success',
            data: { thread }
        }
    }

    async postThreadHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute({ userId, ...request.payload });

        const response = h.response({
            status: 'success',
            data: {
                addedThread
            },
        });
        response.code(201);
        return response;
    }

    async postThreadAddCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const { id: threadId } = request.params;
        const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
        const addedComment = await addCommentUseCase.execute({ userId, threadId, ...request.payload });

        const response = h.response({
            status: 'success',
            data: {
                addedComment
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const { threadId, commentId } = request.params;
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        await deleteCommentUseCase.execute({ userId, threadId, commentId });
        return {
            status: 'success',
        }
    }
}

module.exports = ThreadsHandler;
