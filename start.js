const http = require('http');
const https = require('https');
const express = require('express');
const app = express();
const router = require('./router.js');

app.use(express.static('./public'));
app.use('/', router);

http.createServer(app).listen(3002, () => {
    console.log("server is running at port " + 3002)
});