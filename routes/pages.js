const express = require('express');
const router = express.Router();
const ecc = require('../model/Ecc');
const fs = require("fs")

var data = ecc.getEcc();
var searchValue = "";

router.get('/api/search', (req, res) => {
    if(req.query['q']) {
            if(!req.query['search-type']){
                searchValue = req.query['q'];
            }
            let regex;
            let subset;
            if(req.query['search-type'] == 'Product') {
                regex = new RegExp("^.*"+ req.query['q'].toUpperCase() +".*$", 'g');
                subset = data.filter(item => item['productName'].match(regex));
            } else if(req.query['search-type'] == 'Scrum') {
                regex = new RegExp("^.*"+ req.query['q'] +".*$", 'g');
                subset = data.filter(item => item['scrumMasterName'].match(regex));
            } else if(req.query['search-type'] == 'Dev') {
                regex = new RegExp("^.*"+ req.query['q'] +".*$", 'g');
                subset = data.filter(item => item['developers'].toString().match(regex));
            }
            if( subset.length > 0 ) {
                res.status(200).render("pages", {projects : subset, headers: Object.keys(subset[0])});
            } else {
                res.status(200).render("pages", {projects : [], headers: Object.keys(data[0])});
            }
    } else if (req.query['search-type']) {
        res.status(200).render(`searchSwap${req.query['search-type']}`, { search: searchValue });
    } else {
        res.status(200).render("pages", {projects : data, headers: Object.keys(data[0])});
    }   
});

router.get('/api/add', (req, res) => {
    let template = {
        productName: "...",
        productOwnerName:"...",
        developers:"...",
        scrumMasterName:"...",
        methodology:"Agile",
        location:"..."
    };
    
    res.status(200).render("add", {items : template});
});

router.get('/api/product/:urlToShorten(*)', (req, res) => {
    if(req.params[0]) {
        let regex = new RegExp("^" + req.params[0] + "$", 'g')
        let subset = data.filter(item => item['productId'].match(regex));
        if( subset.length > 0 ) {
            res.status(200).render("view", {items : subset[0]});
        } else {
            res.redirect('/404');
        }
    } else {
        res.redirect('/404');
    }
});

router.post('/api/search', (req, res) => {
    let id = "";
    let regex = new RegExp("^" + id + "$", 'g')
    do {
        id = Math.random().toString(36).slice(2);
        regex = new RegExp("^" + id + "$", 'g')
    } while (data.filter(item => item['productId'].match(regex)) > 0)
    if(req.body["productName"]) {
        let template = {
            productId: id,
            productName: req.body["productName"].toUpperCase(),
            productOwnerName: req.body["productOwnerName"],
            developers: req.body["developers"].split(','),
            scrumMasterName: req.body["scrumMasterName"],
            startDate: new Date().toLocaleDateString('en-ZA'),
            methodology: req.body["radio"],
            location: req.body["location"]
        };
        data.push(template);
        fs.writeFileSync('./db.json', JSON.stringify(data), error => {
            if (error) throw error;
        });
        res.status(200).render("pages", {projects : data, headers: Object.keys(data[0])});
    } else {
        res.status(400)
    }
});

router.get('/api/edit/:urlToShorten(*)', (req, res) => {
    if(req.params[0]) {
        let regex = new RegExp("^" + req.params[0] + "$", 'g')
        let subset = data.filter(item => item['productId'].match(regex));
        if( subset.length > 0 ) {
            res.status(200).render("edit", {items : subset[0]});
        } else {
            res.redirect('/404');
        }
    } else {
        res.redirect('/404');
    }
});

router.patch('/api/save/:urlToShorten(*)', (req, res) => {
    if(req.params[0]) {
        let newData = data.map(item => 
            item.productId === req.params[0] ? {
                ...item, productName: req.body["productName"].toUpperCase(),
                productOwnerName: req.body["productOwnerName"],
                developers: req.body["developers"].split(','),
                scrumMasterName: req.body["scrumMasterName"],
                startDate: req.body["startDate"],
                methodology: req.body[`radio-${req.params[0]}`],
                location: req.body["location"],
            } : item
        )
        fs.writeFileSync('./db.json', JSON.stringify(newData), error => {
            if (error) throw error;
        })
        data = ecc.getEcc();
        
        let subset = {
            productId: req.params[0],
            productName: req.body["productName"].toUpperCase(),
            productOwnerName: req.body["productOwnerName"],
            developers: req.body["developers"].split(','),
            scrumMasterName: req.body["scrumMasterName"],
            startDate: req.body["startDate"],
            methodology: req.body[`radio-${req.params[0]}`],
            location: req.body["location"],
        };
        subset.productId = req.params[0];
        res.status(200).render("save", {items : subset});
    } else {
        res.redirect('/404');
    }
});

router.delete('/api/delete/:urlToShorten(*)', (req, res) => {
    if(req.params[0]) {
        let regex = new RegExp("^(?!"+req.params[0]+"$).*$", 'g')
        let subset = data.filter(item => item['productId'].match(regex));
        fs.writeFileSync('./db.json', JSON.stringify(subset), error => {
            if (error) throw error;
        })
        data = ecc.getEcc();
        res.status(200).render("delete", {projects : subset, headers: Object.keys(subset[0])});
    } else {
        res.redirect('/404');
    }
});

router.get('/', (req, res) => {
    res.redirect('/api/search');
});

router.get('(\/[a-zA-Z0-9]*)+', (req, res) => {
    res.status(404).send("404");
});

module.exports = router;