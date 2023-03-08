/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        thread_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "threads",
        },
        user_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "users",
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('comments');
};
