'use strict';
const https = require('https');
const http = require('http');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));

const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const app = express();
const [HOST, PORT] = ['0.0.0.0', process.env.PORT || 3000];
const accessLogStream = fs.createWriteStream(
	path.join(__dirname, './utils/logStream.log'),
	{flags: 'a'}
)

app.use(logger('dev', {stream: accessLogStream}));
mongoose.set('debug', (collectionName, methodName) => {
	accessLogStream.write(`Mongoose: ${collectionName}.${methodName}()\n`);
});

app.use('/', require('./config/express'));

http
	.createServer(app)
	.listen(PORT, HOST, () => console.log(`Express is now running on http://${HOST}:${PORT}`))
	.on('error', function(err) {
		console.error(`Connection error: ${err}`);
		this.close(() => {
			console.error(`The connection has been closed.`);
			process.exit(-2);
		});
	});
// https
// 	.createServer({
// 		key: fs.readFileSync(__dirname + '/utils/privatekey.pem'),
// 		ca: fs.readFileSync(__dirname + '/utils/certauthority.pem'),
// 		cert: fs.readFileSync(__dirname + '/utils/certificate.pem')
// 	}, app)
// 	.listen(PORT+10, HOST, () => console.log(`Express is now running on https://${HOST}:${PORT+10}`))
// 	.on('error', function(err) {
// 		console.error(`connection error: ${err}`);
// 		this.close(() => {
// 			console.error(`The connection has been closed.`);
// 			process.exit(-2);
// 		});
// 	});
