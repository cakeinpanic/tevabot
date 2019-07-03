import './ping.ts'

import './actions.ts';

import './database/firebase';

import './groups';
import './facts';
import './name';

import './replys';
import './help';
import './boring';
import './settings'
// todo: "в какой я группе", удаление бота и очистка группы

const express = require('express');
var packageInfo = require('./package.json');
var app = express();

app.get('/', function (req, res) {
    res.json({ version: packageInfo.version });
});

var server = app.listen(process.env.PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Web server started at http://%s:%s', host, port);
});