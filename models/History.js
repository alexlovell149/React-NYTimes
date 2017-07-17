var mongoose = require("mongoose");
require('mongoose-type-url');
var Schema = mongoose.Schema;

var HistorySchema = new Schema({
    title: {
        type: String,
        uppercase: true,
        required: true
    },
    date: {
        type: Date,
        trim: true,
        default: Date.now,
        required: true
    },
    urls: {
        type: String,
        required: true,
        unique: true
    }
});


var History = mongoose.model("History", HistorySchema);
module.exports = History;
