const express = require('express');
const app = express();
const q = require('q');

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const cors = require('cors');
app.use(cors());

const pool = require('./config/db.pool.js');
const ibmdb = require('./config/db.js');

var bodyParser = require('body-parser');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
    extended: true
}));

const medico = require('./medico/medico.js');
const consulta = require('./consulta/consulta.js');
const horario = require('./horario/horario.js');

app.get('/api/medico/:crm', medico.get.byCrm);
app.get('/api/consulta/:crm/:day/:month/:year', consulta.get.byDay);
app.get('/api/consulta/:crm/:month/:year', consulta.get.byMonth);
app.get('/api/horario/:crm/:month/:year', horario.get.byDay);
app.post('/api/horario/post', horario.post);

// login
//app.post('/login/:crm/:password');


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', () => {
    // print a message when the server starts listening
    console.log("Server started on " + appEnv.url);
});