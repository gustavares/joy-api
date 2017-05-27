const express = require('express');
const app = express();
var q = require('q');

const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv()

const pool = require('./config/db.pool.js');
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', () => {
    // print a message when the server starts listening
    console.log("Server started on " + appEnv.url);
});

// Error handler in case of Token Issues
app.use('/api', function (err, req, res, next) {
    return res.status(401).send(err.name + ': ' + err.message);
});

const medico = require('./medico/medico.js');
app.get('/api/medico/:id', medico.get.byId);
//app.post('/api/medico/post', medico.post);

