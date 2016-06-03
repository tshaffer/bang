/**
 * Created by tedshaffer on 6/3/16.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require("fs");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/index.html', express.static(path.join(__dirname, '../bangClient/index.html')));
app.use('/', express.static(path.join(__dirname, '../bangClient/')));

function handleError(err) {
    console.log("handleError invoked");
    return;
}

console.log("bangServer listening on port 6969");

var port = process.env.PORT || 6969;
app.listen(port);
