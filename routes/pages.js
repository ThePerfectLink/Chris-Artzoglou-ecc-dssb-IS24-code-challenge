const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const ecc = require('../model/Ecc');
const fs = require("fs")

var data = ecc.getEcc();
//console.log(data);

var option = {
    root: __dirname
}

router.get('/api/search', (req, res) => {
    if(req.query['q']) {
        let regex = new RegExp("^.*"+ req.query['q'].toUpperCase() +".*$", 'g')
        let subset = data.filter(item => item['productName'].match(regex));
        if( subset.length > 0 ) {
            res.status(200).render("pages", {projects : subset, headers: Object.keys(subset[0])});
        } else {
            res.status(200).render("pages", {projects : data, headers: Object.keys(data[0])});
        }
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
    console.log(req.params)
    console.log(req.body)
    if(req.params[0]) {
        let regex = new RegExp("^" + req.params[0] + "$", 'g')
        let subset = data.filter(item => item['productId'].match(regex));
        if( subset.length > 0 ) {
            console.log(subset)
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
    console.log(req.body);
    if(req.body["productName"]) {
        console.log(req.body)
        let template = {
            productId: id,
            productName: req.body["productName"],
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
            console.log(subset)
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
                ...item, productName: req.body["productName"],
                productOwnerName: req.body["productOwnerName"],
                developers: req.body["developers"].split(','),
                scrumMasterName: req.body["scrumMasterName"],
                startDate: req.body["startDate"],
                methodology: req.body["methodology"],
                location: req.body["location"],
            } : item
        )
        fs.writeFileSync('./db.json', JSON.stringify(newData), error => {
            if (error) throw error;
        })
        data = ecc.getEcc();
        
        let subset = {
            productId: req.params[0],
            productName: req.body["productName"],
            productOwnerName: req.body["productOwnerName"],
            developers: req.body["developers"].split(','),
            scrumMasterName: req.body["scrumMasterName"],
            startDate: req.body["startDate"],
            methodology: req.body["methodology"],
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
    console.log("FUCK")
    res.redirect('/api/search');
});

router.get('(\/[a-zA-Z0-9]*)+', (req, res) => {
    console.log(404)
    res.status(404).send("404");
});

module.exports = router;