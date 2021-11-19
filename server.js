const path = require('path');
const express = require('express');
require('dotenv').config({
    NODE_ENV: 'production',
});

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function () {
    console.log('listening on port ', server.address().port);
});
