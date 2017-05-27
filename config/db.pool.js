const Q = require('q');
const Pool = require("ibm_db").Pool;


const credentials = {
  "port": 50000,
  "db": "BLUDB",
  "username": "dash14517",
  "ssljdbcurl": "jdbc:db2://dashdb-entry-yp-dal09-10.services.dal.bluemix.net:50001/BLUDB:sslConnection=true;",
  "host": "dashdb-entry-yp-dal09-10.services.dal.bluemix.net",
  "https_url": "https://dashdb-entry-yp-dal09-10.services.dal.bluemix.net:8443",
  "dsn": "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-dal09-10.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=dash14517;PWD=dOdLY6y2T@#b;",
  "hostname": "dashdb-entry-yp-dal09-10.services.dal.bluemix.net",
  "jdbcurl": "jdbc:db2://dashdb-entry-yp-dal09-10.services.dal.bluemix.net:50000/BLUDB",
  "ssldsn": "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-dal09-10.services.dal.bluemix.net;PORT=50001;PROTOCOL=TCPIP;UID=dash14517;PWD=dOdLY6y2T@#b;Security=SSL;",
  "uri": "db2://dash14517:dOdLY6y2T@#b@dashdb-entry-yp-dal09-10.services.dal.bluemix.net:50000/BLUDB",
  "password": "dOdLY6y2T@#b"
};

const cn = `DATABASE=${credentials.db};HOSTNAME=${credentials.hostname};PORT=${credentials.port};PROTOCOL=TCPIP;UID=${credentials.username};PWD=${credentials.password}`;

const pool = new Pool();

module.exports = {
    open: open,
    query: query
};

/**
 * Gets a connection inside the pool
 * 
 * @returns The connection caught from the pool
 */
function open() {
    const deferred = Q.defer();

    pool.open(cn, function(err, conn) {
        if (err) {
            deferred.reject(err.message);
        } else {
            deferred.resolve(conn);
        }
    });

    return deferred.promise;
}

/**
 * Execute a sql statement inside the database
 * 
 * @param {any} conn The connection caught from the 'open' method
 * @param {any} sql The sel which will be executed
 * @returns The result of the sql execution
 */
function query(conn, sql, newValues) {
    const deferred = Q.defer();
    
    conn.query(sql, newValues, function(error, res) {
        if (error) {
            deferred.reject(error.message);
        } else {
            deferred.resolve(res);
        }
    });

    return deferred.promise;
}