var q = require('q');
const pool = require('./../config/db.pool.js');

module.exports = {
    get: {
        byId: function (req, res) {
            const id = req.params.id;
            const query = "SELECT * FROM MEDICO WHERE MEDICO_ID = " + id;
            var deferred = q.defer();

            pool.open()
                .then(executeQuery)
                .then(success, fail)
                .finally(function() {
                    pool.close();
                });

            function executeQuery(conn) {
                //return of the query
                console.log("executing query");
                return pool.query(conn, query);
            }

            function success(result) {
                //if success to be executed
                console.log("success");
                res.status(200).json(result[0]);

                deferred.resolve(result);
            }

            function fail(err) {
                console.log(err);

                deferred.reject({
                    'error': '500 could not retrieve data from the database'
                });
            }
            return deferred.promise; 
        }
    }

};