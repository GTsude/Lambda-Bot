const R = require("ramda");
const { createSelectQuery, createInsertQuery, createUpdateQuery, createDeleteQuery, createNow } = require('./database.js');

const getMasters = (connection, slaveID) => new Promise((resolve, reject) => {
    connection.query(createSelectQuery('ownership', `slaveID = '${slaveID}'`), (err, rows) => {
        if ( err ) reject(err);
        else resolve(rows);
    });
});

const getSlaves = (connection, masterID) => new Promise((resolve, reject) => {
    connection.query(createSelectQuery('ownership', `masterID = '${masterID}'`), (err, rows) => {
        if ( err) reject(err);
        else resolve(rows);
    });
});

const addSlave = (connection, masterID, slaveID) => new Promise(async (resolve, reject) => {
    const slaves = await getSlaves(connection, masterID);

    if ( R.contains(slaveID)(R.map( v => v.slaveID )(slaves)) ) {
        resolve();
    } else {
        const query = createInsertQuery('ownership', {
            created: createNow(),
            masterID: masterID,
            slaveID
        });
        console.log(query);
        connection.query(query, resolve);
    }
});

const removeSlave = (connection, masterID, slaveID) => new Promise(async (resolve, reject) => {
    const slaves = await getSlaves(connection, masterID);

    if ( !R.contains(slaveID)(R.map( v => v.slaveID )) ) resolve();
    else connection.query(createDelete('ownership', `slaveID = '${slaveID}', masterID = '${masterID}'`), resolve);
});

module.exports = {
    getMasters,
    getSlaves,
    addSlave,
    removeSlave
};
