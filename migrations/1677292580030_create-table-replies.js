/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        comment_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "comments",
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
            type: 'TIMESTAMP',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('replies');
};
