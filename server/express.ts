const express = require('express');
const packageInfo = require('../package.json');
const app = express();

app.get('/', function(req, res) {
    res.json({version: packageInfo.version});
});

export const startServer = () => {
    var server = app.listen(process.env.PORT, function() {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Web server started at http://%s:%s', host, port);
    });
};
