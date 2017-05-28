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
        }
    },
    post: function(req, res) {
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
       
        while(start.isBefore(end)) {
            let minutesStart = start.minutes() < 10 ? ('0' + start.minutes()) : start.minutes();
            
            let month = start.month() + 1;
            month = month < 10 ? ('0' + month) : month;
            
            
            let startDate = 
              start.date() + "/" +
              month + "/" + // moment .months() is from 0 to 11
              start.year() + " " +
              start.hours() + ":" +
              minutesStart;

            let appointmentEnd = moment(startDate, "DD-MM-YYYY HH-mm").add(30, 'minutes');

            let minutesEnd = appointmentEnd.minutes() < 10 ? ('0' + appointmentEnd.minutes()) : appointmentEnd.minutes();

            let endDate = 
              appointmentEnd.date() + "/" +
              month + "/" + 
              appointmentEnd.year() + " " +
              appointmentEnd.hours() + ":" +
              minutesEnd;

            availableTimes.push({
                start: startDate,
                end: endDate
            });
            
            start.add(30, 'minutes');
        }
        
        let startAppointment, endAppointment;
        const query = "INSERT INTO CONSULTA (crm, inicio, fim) values (" + crm + "," + startAppointment + "," + endAppointment + ")";
        availableTimes.forEach(function(item) {
            startAppointment = item.start;
            endAppointment = item.end;

            ibmdb.open()
            .then(executeQuery)
            .then(success, fail)
            .finally(function() {
                ibmdb.close();
            });
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
}