/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.alterColumn('comments', 'thread_id', {
        notNull: false
    })
    pgm.addColumns('comments', {
        comment_id: {
            type: "VARCHAR(50)",
            notNull: false,
            references: "comments",
        },
    })
};

exports.down = pgm => {
    pgm.alterColumn('comments', 'thread_id', {
        notNull: true
    })
    pgm.dropColumns('comments', ['comment_id'])
};
