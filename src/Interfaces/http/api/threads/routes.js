const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadHandler,
        options: {
            auth: 'forum_jwt',
        },
    },
    {
        method: 'GET',
        path: '/threads/{threadId}',
        handler: handler.getThreadHandler,
    },
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.postThreadAddCommentHandler,
        options: {
            auth: 'forum_jwt',
        },
    },
    {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: handler.postThreadCommentAddReplyHandler,
        options: {
            auth: 'forum_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: handler.deleteCommentHandler,
        options: {
            auth: 'forum_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        handler: handler.deleteReplyCommentHandler,
        options: {
            auth: 'forum_jwt',
        },
    },
]);

module.exports = routes;
