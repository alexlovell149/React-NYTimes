var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var express = require("express");
// Snatches HTML from URLs
var request = require("request");

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


mongoose.connect('mongodb://heroku_b2d4rh1s:m1c67ar9dt3ld0f11ag55e23a6@ds161742.mlab.com:61742/heroku_b2d4rh1s');

var db = mongoose.connection;

db.on("error", function(err) {
    console.log("Mongoose Error: ", err);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

app.get('/', function(req, res) {
    res.sendFile('./public/index.html');
});

app.get('/api/saved', function(req, res) {

    History.find({}, function(err, found) {
        if (err) {
            console.log(err);
        } else {
            res.json(found);
        }
    });
});



app.post('/api/saved', function(req, res) {

    var content = new History({
        title: req.body.title,
        date: req.body.date,
        url: req.body.url
    });

    content.save(function(err, found) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.json(found);
        }
    });

});

app.delete('/api/saved/:id', function(req, res) {
    History.find({ "_id": req.params.id }).remove()
        .exec(function(err, found) {
            res.send(found);
        });
})


app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});
