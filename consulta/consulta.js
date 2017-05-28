const q = require('q');
const ibmdb = require('./../config/db.js');
const moment = require('moment');

module.exports = {
    get: {
        byDay: function (req, res) {
            const crm = req.params.crm;
            const day = req.params.day;
            const month = req.params.month;
            const year = req.params.year;
            const query = "SELECT * FROM CONSULTA WHERE INICIO LIKE '" + day + "/" + month + "/" + year + "%' AND CRM = '" + crm + "'";
            var deferred = q.defer();

            ibmdb.open()
                .then(executeQuery)
                .then(success, fail)
                .finally(function () {
                    ibmdb.close();
                });

            function executeQuery(conn) {
                //return of the query
                console.log("executing query");
                return ibmdb.query(conn, query);
            }

            function success(result) {
                //if success to be executed
                console.log("success");
                res.status(200).json(result);

                deferred.resolve(result);
            }

            function fail(err) {
                console.log(err);

                deferred.reject({
                    'error': '500 could not retrieve data from the database'
                });
            }
            return deferred.promise;
        },
        byMonth: function(req, res) {
            const crm = req.params.crm;
            const month = req.params.month;
            const year = req.params.year;
            const query = "SELECT * FROM CONSULTA WHERE INICIO LIKE '" + month + "/" + year + "%' AND CRM = '" + crm + "'";
            var deferred = q.defer();

            ibmdb.open()
                .then(executeQuery)
                .then(success, fail)
                .finally(function () {
                    ibmdb.close();
                });

            function executeQuery(conn) {
                //return of the query
                console.log("executing query");
                return ibmdb.query(conn, query);
            }

            function success(result) {
                //if success to be executed
                console.log("success");
                res.status(200).json(result);

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
    },
    post: function (req, res) {
        const crm = req.body.crm;
        const cpf = req.body.cpf;
        const start = moment(req.body.start, "DD-MM-YYYY HH-mm");
        const end = moment(req.body.end, "DD-MM-YYYY HH-mm");

        console.log(start);
        console.log(end);

        const insertQuery = "INSERT INTO CONSULTA (crm, cpf, inicio, fim) values (" + crm + "," + "," + start + "," + end + ")";

        // insert consulta
        var deferred = q.defer();

        function executeQuery(conn) {
            //return of the query
            console.log("executing query");
            return ibmdb.query(conn, query);
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
    },
    insertAvailableTimes: function (crm, start, end) {
        let availableTimes = [];

        console.log(start);
        console.log(end);
        start = new Date(start);
        end = new Date(end);

        let milliStart = start.getTime();
        let milliEnd = end.getTime();
        let gap = start.getTime() + (60 * 30 * 1000);

        let schedule = [{ start, end: new Date(gap) }];

        while (gap < milliEnd) {
            milliStart = gap;
            gap = gap + (60 * 30 * 1000);

            let time = {
                start: new Date(milliStart),
                end: new Date(gap),
            };

            if (gap <= milliEnd)
                schedule = [...schedule, time]
        }

        console.log(schedule);

        const queries = availableTimes.map(function (item) {
            return "INSERT INTO CONSULTA (crm, inicio, fim) values (" + crm + ",'" + item.start + "','" + item.end + "')";
        });
        console.log(queries);
        queries.forEach(function (query) {
            openConn(query);
        });
    }
}
function openConn(query) {
    ibmdb.open()
        .then(conn => executeQuery(conn, query))
        .then(success, fail)
        .finally(function () {
            ibmdb.close();
        });
}
function executeQuery(conn, query) {
    //return of the query
    console.log("executing query");
    return ibmdb.query(conn, query);
}

function success(result) {
    //if success to be executed
    console.log("success");
    return true;
}

function fail(err) {
    console.log(err);

    throw new Error('500 could not retrieve data from the database');
}
