const db = require("../models");

module.exports = function (app) {
    //render index
    app.get('/', function (req, res) {
        res.render('index');
    });
    

}


  