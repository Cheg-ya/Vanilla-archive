const express = require('express');
const scrape = require('website-scraper');
const fs = require('fs');
const router = express.Router();
const Webpage = require('../models/Webpage.js');
const del = require('del');

const options = {
  urls: [],
  directory: '',
  sources: [
    { selector: 'img', attr: 'src' },
    { selector: 'link[rel="stylesheet"]', attr: 'href' }
  ],
  ignoreError: true,
  maxDepth: 1
};

router.post('/web/search', async (req, res, next) => { //중복요청 블럭 client side handling
  const requestUrl = req.body.url;
  const isUserConfirmed = req.body.userConfirm;
  const webpageDirectoryPath = `./public/assets/${requestUrl}`;
  let fileExists = fs.existsSync(webpageDirectoryPath);

  options.urls = [`http://${requestUrl}`];
  options.directory = `./public/assets/${requestUrl}`;

  if (fileExists) {
    del.sync(['public/assets/**', '!public/assets']);
    fileExists = false;
  }

  const webpagesFromDB = await Webpage.find({ url: requestUrl }).lean();
  debugger;
  if (!webpagesFromDB.length && !isUserConfirmed) {
    return res.json({
      isSaved: false,
      isSingleData: null,
      message: 'Data hasn\'t been stored in DB yet'
    });
  }

  if (!webpagesFromDB.length) {
    scrape(options).then((result) => { //origin url 사용 필요?
      const { type, text, filename, children } = result[0];
      const cssFiles = children.filter(file => file.type === 'css');
      const imageFiles = children.filter(file => !file.type);

      const newPage = new Webpage({
        url: requestUrl,
        type: type,
        text: text,
        filename: filename,
        createdAt: new Date().toISOString(),
        css: cssFiles,
        images: imageFiles
      });

      newPage.save(err => {
        if (err) return next(err);
      });
      console.log('new data saved');
      res.json({
        isSaved: true,
        isSingleData: true,
        url: requestUrl
      });
    }).catch(err => {
      return res.json({ message: 'The website doesn\'t exist', status: 404});
    });

  } else if (webpagesFromDB.length === 1) {
    const webpage = webpagesFromDB[0];

    if (!fileExists) {
      fs.mkdirSync(webpageDirectoryPath);
      fs.mkdirSync(`${webpageDirectoryPath}/css`);
      fs.mkdirSync(`${webpageDirectoryPath}/images`);
      fs.mkdirSync(`${webpageDirectoryPath}/fonts`);
    }

    fs.writeFileSync(`${webpageDirectoryPath}/${webpage.filename}`, webpage.text);

    if (webpage.css.length) {
      webpage.css.forEach(css => {
        fs.writeFileSync(`${webpageDirectoryPath}/${css.filename}`, css.text);
      });
    }

    if (webpage.images.length) {
      webpage.images.forEach(image => {
        fs.writeFileSync(`${webpageDirectoryPath}/${image.filename}`, image.text, 'binary');
      });
    }

    console.log('fetch data from DB');

    res.json({
      isSaved: false,
      url: requestUrl,
      isSingleData: true
    });

  } else {
    console.log('number of data');
    res.json({
      isSaved: false,
      isSingleData: false,
      url: requestUrl
    });
  }
});

router.post('/web/update', async (req, res, next) => { //url validator 찾아보기
  const requestUrl = req.body.url;
  const webpageDirectoryPath = `./public/assets/${requestUrl}`;
  const fileExists = fs.existsSync(webpageDirectoryPath);

  options.urls = [`http://${requestUrl}`];
  options.directory = `./public/assets/${requestUrl}`;

  if (fileExists) {
    del.sync(['public/assets/**', '!public/assets']);
  }

  scrape(options).then((result) => {
    const { type, text, filename, children } = result[0];
    const cssFiles = children.filter(file => file.type === 'css');
    const imageFiles = children.filter(file => !file.type);

    const newPage = new Webpage({
      url: requestUrl,
      type: type,
      text: text,
      filename: filename,
      createdAt: new Date().toISOString(),
      css: cssFiles,
      images: imageFiles
    });

    newPage.save(err => {
      if (err) return next(err);
    });
    console.log('date saved in DB');

    res.json({
      url: requestUrl,
      message: 'Data safely stored in DB'
    });
  }).catch(err => {
    return res.json({ message: 'The website doesn\'t exist', status: 404});
  });
});

module.exports = router;
