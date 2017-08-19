const mysql = require("mysql");
const moment = require('moment');
const R = require("ramda");
const { stripIndents } = require("common-tags");
const { escapeQuotes } = require("./utility.js");

const createNow = () => moment().format('YYYY-MM-DD HH:mm:ss');

const createConnection = auth => mysql.createConnection({
    host: auth.mysqlHostName || 'localhost',
    user: auth.mysqlUsername,
    password: auth.mysqlPassword,
    database: auth.mysqlDatabase || 'lambda'
});

const logMessage = (connection, message) => connection.query(createInsertQuery('messageLogs', {
    channel: message.channel.id,
    userid: message.author.id,
    username: message.author.username,
    message: message.content.toString() + (message.attachments.size > 0 ? `Attachments::[${message.attachments.map( a => a.url).join(', ')}]` : ''),
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
}));

const createInsertQuery = (table, dict) =>
    stripIndents `
    INSERT INTO ${table}
        (${Object.keys(dict).join(', ')})
        VALUES
        (${Object.values(dict).map(v => "'" + escapeQuotes(v) + "'")})`;

const createUpdateQuery = (table, dict, predicates) =>
    stripIndents `
    UPDATE ${table} SET ${Object.keys(dict).map( key =>
        `${key} = '${dict[key]}'`
    ).join(", ")} ${predicates ? `WHERE ${predicates}` : ''}`;

const getUserQuery = userID => `SELECT * FROM users WHERE id='${userID}'`;

const updateUser = (connection, userID, modfn) => new Promise(function(resolve, reject) {
    getUser(connection, userID).then(user => {
        // modfn :: Functor<user>
        const after = modfn(user);

        const query = createUpdateQuery('users', after, `id = ${userID}` );

        connection.query(query, (err, rows) => {
            if ( err ) reject(err);
            else resolve(after);
        });
    }).catch(reject);
});


const getUser = (conn, userID) => new Promise((resolve, reject) => {
    conn.query(getUserQuery(userID), (err, rows) => {
        if (err) reject(err);
        else if (rows.length === 0) createUser(conn, userID).then(resolve).catch(reject);
        else resolve(rows[0]);
    });
});

const createUserQuery = userID => {
    const date = moment().format('YYYY-MM-DD HH:mm:ss');

    return createInsertQuery('users', {
        id: userID,
        balance: 0,
        experience: 0,
        created_timestamp: date,
        lastmessage_timestamp: date
    });
};


const createUser = (connection, userID) => new Promise((resolve, reject) => {
    return connection.query(createUserQuery(userID), (err, rows) => {
        return err ? reject(err) : resolve(getUser(userID));
    });
});

module.exports = {
    createNow,
    createConnection,
    createInsertQuery,
    createUpdateQuery,
    createUser,
    getUser,
    updateUser,
    logMessage
};
