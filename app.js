const express = require('express');
const app = express();
var q = require('q');

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv()

var cors = require('cors');
app.use(cors());

const pool = require('./config/db.pool.js');
const ibmdb = require('./config/db.js');

const medico = require('./medico/medico.js');
app.get('/api/medico/:crm', medico.get.byCrm);
app.get('/api/consulta/:crm/:currentMonth/:currentYear', consulta.get.byMonth);
//app.post('/api/medico/post', medico.post);

// login
//app.post('/login/:crm/:password');


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', () => {
    // print a message when the server starts listening
    console.log("Server started on " + appEnv.url);
});