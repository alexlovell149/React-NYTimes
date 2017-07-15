// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require("axios");

module.exports = {
  // Returns a promise object we can .then() off inside our Parent component
  getArticles: function() {
    return axios.get("/scrape/:id");
  },
  // Also returns a promise object we can .then() off inside our Parent component
  // This method takes in an argument for what to post to the database
  postArticles: function(title, date, url) {
    return axios.post("/scrape/:id", {title: title, date:date, url:url});
  }
};