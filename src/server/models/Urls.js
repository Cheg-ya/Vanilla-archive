const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
  url: String
});

module.exports = Url = mongoose.model('url-lists', UrlSchema);
