const fs = require("fs")

const startDate = new Date(2010,1,1);
const endDate = new Date();
const genValues = JSON.parse(fs.readFileSync('./genValues/names.json'));
const genAmount = 40;


function genEcc () {
    let list = [];
    for(let i = 0; i < genAmount; i++) {
        list.push(new Ecc());
    }
    fs.writeFileSync('./db.json', JSON.stringify(list), error => {
        if (error) throw error;
    })
};

class Ecc {
    constructor() {
        this.productId = Math.random().toString(36).slice(2);
        this.productName = genValues["productNameBegin"][Math.floor(Math.random()*genValues["productNameBegin"].length)] + " " + genValues["productNameEnd"][Math.floor(Math.random()*genValues["productNameEnd"].length)];
        this.productOwnerName = genValues["names"][Math.floor(Math.random()*genValues["names"].length)];
        this.developers = [];
        let devs = Math.ceil(Math.random()*5);
        for(let i=0; i < devs; i++) {        
            this.developers.push(genValues["names"][Math.floor(Math.random()*genValues["names"].length)]);
        }
        this.scrumMasterName = genValues["names"][Math.floor(Math.random()*genValues["names"].length)];
        this.startDate = new Date(+startDate + Math.random() * (endDate-startDate)).toLocaleDateString('en-ZA');
        this.methodology = genValues["methodologies"][Math.floor(Math.random()*genValues["methodologies"].length)];
        this.location = "https://github.com/"+this.productOwnerName.replace(/\s+/g, '-').toLowerCase()+"/"+this.productName.replace(/\s+/g, '-').toLowerCase();
    }
}


function getEcc()  {
    return JSON.parse(fs.readFileSync('./db.json'));
}

module.exports['getEcc'] = getEcc;
module.exports['genEcc'] = genEcc;