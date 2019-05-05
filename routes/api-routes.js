// Scraping tools
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("../models");


module.exports = function (app) {
    
    // A POST route for scraping the website
    app.post("/api/scrape", function(req, res) {
        // First, grab the body of the html with axios
        axios.get("https://www.theonion.com/").then(function(response) {
        // Load into cheerio and save it to $ as a shorthand selector
        var $ = cheerio.load(response.data);
    
        // Now, we grab every h2 with the c-entry class, and do the following:
        $("article.post-item-frontpage").each(function(i, element) {

            // Save an empty result object
            // var result = {};
    
            // Add the text and href of every link, and save them as properties of the result object
            // result.title = $(this)
            // .children().text();
            // result.link = $(this)
            // .children().attr("href");

            let title = $(element).find('.headline').text();
            let summary = $(element).find('.item__content').find('.excerpt').children().text();
            let link = $(element).find('.headline').children().attr("href");
            let photo = $(element).find('.item__content').find('.img-wrapper').find('source').attr("data-srcset");
            let date = $(element).find('.meta--pe').find('time').attr("datetime");

            let result = {
                title: title,
                summary: summary,
                link: link,
                photo: photo,
                date: date
            }
    
            // Create a new Article using the `result` object 
            db.Article.create(result)
            .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
            });

        });
    
        // Send a message to the client
        res.send("Scrape Complete");
        });
    });

    //Route for getting the current number of articles
    app.get("/api/all", function (req, res) {

        db.Article.find({
                $query: {
                    saved: false
                }
            }).sort({
                date: -1
            })
            .then(function (response) {
                res.json(response.length)
                // res.json(response)
            })

    });
    
    // Route for getting all Articles from the db
    app.get("/api/articles", function(req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
        .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
    
    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/api/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
    
    // Route for saving/updating an Article's associated Note
    app.post("/api/articles/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
        .then(function(dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });


    //save article ID for list of saved articles
    app.put("/api/save/article/:id", (req, res) => {
        let articleId = req.params.id;
        db.Article.findOneAndUpdate({
            _id: articleId
        }, {
            $set: {
                saved: true
            }
        }).then(function (result) {
            res.json(result)
        })
    });


    
    // delete
    app.delete("/api/reduce", (req, res) => {

        db.Article.find({
                $query: {
                    saved: false
                }
            }).sort({
                date: -1
            })
            .then((found) => {

                console.log(found.length);
                let countLength = found.length;
                let overflow = countLength - 25;
                console.log(overflow)
                let overflowArray = [];

                for (var i = 0; i < (overflow); i++) {
                    overflowArray.push(found[25 + i]._id);
                    console.log(overflowArray)
                }

                db.Article.remove({
                    _id: {
                        $in: overflowArray
                    }
                }, (error, result) => {

                    result["length"] = countLength;
                    console.log(result)
                    res.json(result)

                })

            });

    })

    // delete Article documents from DB
    app.get("/api/clear", function(req, res) {

        db.Article.remove()
            .then(function () {
                res.json("documents removed from Article collection")
            })

    });

    



}


  