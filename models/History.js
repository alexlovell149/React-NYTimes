var mongoose = require("mongoose");
require('mongoose-type-url');
var Schema = mongoose.Schema;

var HistorySchema = new Schema({
  title: {
    type: String,
    uppercase: true
  },
  date: {
    type: Date
  },
  urls: [{type: mongoose.SchemaTypes.Url}]
});


var History = mongoose.model("History", HistorySchema);
module.exports = History;