'use strict';

var server = require('./lib/app');
var database = require('./lib/database');

var cluster = require('cluster');

var port = process.env.PORT || 8030;
var workers = require('os').cpus().length;

database.sync().then(function() {
  server.listen(port);
});

console.log('App listening on port ' + port);
