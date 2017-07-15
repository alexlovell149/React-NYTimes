var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express");
// Snatches HTML from URLs
var request = require("request");
// Scrapes our HTML
var cheerio = require("cheerio");

// Require History Schema
var History = require("./models/History");

// Create Instance of Express
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan for Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("public"));

// -------------------------------------------------

// MongoDB Configuration configuration (Change this URL to your own DB)
mongoose.connect("mongodb://localhost/nytreact");
var db = mongoose.connection;

db.on("error", function(err) {
    console.log("Mongoose Error: ", err);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// Main "/" Route. This will redirect the user to our rendered React application
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape/:id", function(req, res) {
            // Make a request for the news section of ycombinator
            request("https://www.buzzfeed.com/news", function(error, response, html) {
                // Load the html body from request into cheerio
                var $ = cheerio.load(html);
                // For each element with a "title" class
                $("h2.xs-mb05 xs-pt05 sm-pt0 xs-text-4 sm-text-2 bold").each(function(i, element) {
                    // Save the text of each link enclosed in the current element
                    var title = $(this).text();
                    // Save the href value of each link enclosed in the current element
                    var link = $(this).parent("a").attr("href");

                    // If this title element had both a title and a link
                    if (title && link) {
                        // Save the data in the scrapedData db
                        db.scrapedData.save({
                                title: title,
                                link: link
                            },
                            function(error, saved) {
                                // If there's an error during this query
                                if (error) {
                                    // Log the error
                                    console.log(error);
                                }
                                // Otherwise,
                                else {
                                    // Log the saved data
                                    console.log(saved);
                                }
                            });
                    }

                    History.find({}).sort([
                        ["date", "descending"]
                    ]).limit(5).exec(function(err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send(doc);
                        }
                    });
                });

                // This will send a "Scrape Complete" message to the browser
                res.send("Scrape Complete");
            });
        });

        // This is the route we will send POST requests to save each search.
        app.post("/scrape/:id", function(req, res) {
            console.log("BODY: " + req.body.title);

            // Here we'll save the location based on the JSON input.
            // We'll use Date.now() to always get the current date time
            History.create({
                title: req.body.title,
                date: Date.now(),
                url: req.body.url
            }, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send("Saved Search");
                }
            });
        });



        app.listen(PORT, function() {
            console.log("App listening on PORT: " + PORT);
        });
