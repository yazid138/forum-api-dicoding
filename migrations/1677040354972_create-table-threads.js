/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('threads', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: "VARCHAR(50)",
            notNull: true,
            references: "users",
        },
        title: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        body: {
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
    pgm.dropTable('threads');
};
