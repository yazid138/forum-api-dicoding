const { autoBind } = require('auto-bind2');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddReplyCommentUseCase = require('../../../../Applications/use_case/AddReplyCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
const DeleteReplyCommentUseCase = require('../../../../Applications/use_case/DeleteReplyCommentUseCase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        autoBind(this)
    }

    async getThreadHandler(request, h) {
        const { threadId } = request.params;
        const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);
        const thread = await getThreadUseCase.execute(threadId);

        return {
            status: 'success',
            data: {
                thread
            }
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
        const { threadId } = request.params;
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

    async postThreadCommentAddReplyHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const addReplyCommentUseCase = this._container.getInstance(AddReplyCommentUseCase.name);
        const addedReply = await addReplyCommentUseCase.execute({ userId, ...request.params, ...request.payload })

        const response = h.response({
            status: 'success',
            data: {
                addedReply
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
        await deleteCommentUseCase.execute({ userId, ...request.params });
        
        return {
            status: 'success',
        }
    }

    async deleteReplyCommentHandler(request, h) {
        const { id: userId } = request.auth.credentials;
        const deleteReplyCommentUseCase = this._container.getInstance(DeleteReplyCommentUseCase.name);
        await deleteReplyCommentUseCase.execute({ userId, ...request.params });

        return {
            status: 'success',
        }
    }
}

module.exports = ThreadsHandler;
