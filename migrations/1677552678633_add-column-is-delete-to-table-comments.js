/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.addColumns('comments', {
        is_delete: {
            type: "BOOLEAN",
            notNull: true,
            default: false,
        },
    })
};

exports.down = pgm => {
    pgm.dropColumns('comments', ['is_delete'])
};
