const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebpageSchema = new Schema({
  url: String,
  type: String,
  text: String,
  filename: String,
  createdAt: Date,
  css: [
    {
      text: String,
      filename: String,
    }
  ],
  images: [
    {
      text: String,
      filename: String
    }
  ]
});

module.exports = Webpage = mongoose.model('webpages', WebpageSchema);
