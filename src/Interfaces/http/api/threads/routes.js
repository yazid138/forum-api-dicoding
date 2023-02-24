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
        path: '/threads/{id}',
        handler: handler.getThreadHandler,
    },
    {
        method: 'POST',
        path: '/threads/{id}/comments',
        handler: handler.postThreadAddCommentHandler,
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
]);

module.exports = routes;
