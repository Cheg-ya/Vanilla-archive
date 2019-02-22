const express = require('express');
const scrape = require('website-scraper');
const fs = require('fs');
const router = express.Router();
const Webpage = require('../models/Webpage.js');
const del = require('del');

router.get('/', (req,res,next) => {
  debugger;
  console.log(1231123);
  return res.end(123);
});

module.exports = router;
