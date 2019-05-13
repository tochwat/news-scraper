var express = require("express");
var bodyParser = require("body-parser");
var exphbs  = require('express-handlebars');
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

// If deployed, use the deployed database. Otherwise use the local mongoArticles database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoArticles";

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));


// Initialize express-handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  // useMongoClient: true
});
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

//require api and html routes files
require("./routes/index")(app)

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
