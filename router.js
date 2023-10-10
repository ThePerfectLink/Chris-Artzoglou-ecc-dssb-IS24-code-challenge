const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');

var options = {
    root: __dirname
}

router.get('/api/search', (req, res) => {
    res.status(200).sendFile(path.join(options.root, "./public/search/search.html"));
});

router.get('/api/add', (req, res) => {
    res.status(200).sendFile(path.join(options.root, "./public/add/add.html"));
});

app.get('*',function (req, res) {
    res.redirect('/api/search');
});

module.exports = router;
