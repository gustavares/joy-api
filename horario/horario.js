const q = require('q');
const ibmdb = require('./../config/db.js');
const pool = require('./../config/db.pool.js');
const moment = require('moment');

const consulta = require('./../consulta/consulta.js');

module.exports = {
    get: {
        byDay: function (req, res) {
            const crm = req.params.crm;
            const month = req.params.month;
            const year = req.params.year;
            const query = "SELECT * FROM HORARIO WHERE INICIO LIKE '%" + month + "/" + year + "%' AND CRM = '" + crm + "'";
            var deferred = q.defer();

             ibmdb.open()
                .then(executeQuery)
                .then(success, fail)
                .finally(function() {
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
    },
    post: function (req, res) {
        const crm = req.body.crm;
        const start = moment(req.body.start, "DD-MM-YYYY HH-mm");
        const end = moment(req.body.end, "DD-MM-YYYY HH-mm");

        // set doctor's available times
        consulta.insertAvailableTimes(crm, start, end);

        let minutes = start.minutes() < 10 ? ('0' + start.minutes()) : start.minutes();
        let month = start.month() + 1;
        month = month < 10 ? ('0' + month) : month;
        
        let startDate = 
            start.date() + "/" +
            month + "/" + // moment .months() is from 0 to 11
            start.year() + " " +
            start.hours() + ":" +
            minutes;

        let endDate = 
            end.date() + "/" +
            month + "/" + 
            end.year() + " " +
            end.hours() + ":" +
            end.minutes();

        const query = "INSERT INTO HORARIO (crm, inicio, fim) values (" + crm + "," + startDate + "," + endDate + ")";
        
        ibmdb.open()
            .then(executeQuery)
            .then(success, fail)
            .finally(function() {
                ibmdb.close();
            });

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
    }
};