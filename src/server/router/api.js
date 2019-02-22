const express = require('express');
const scrape = require('website-scraper');
const fs = require('fs');
const router = express.Router();
const Webpage = require('../models/Webpage.js');
const del = require('del');

router.post('/web', async (req, res, next) => { //중복요청 블럭 client side handling
  const requestUrl = req.body.url;
  const webpageDirectoryPath = `./public/assets/${requestUrl}`;
  let fileExists = fs.existsSync(webpageDirectoryPath);

  if (fileExists) {
    del.sync(['public/assets/**', '!public/assets']);
    fileExists = false;
  }

  const webpagesFromDB = await Webpage.find({ url: requestUrl }).lean();

  if (!webpagesFromDB.length) {
    const options = {
      urls: [`http://${requestUrl}`],
      directory: `./public/assets/${requestUrl}`,
      sources: [
        { selector: 'img', attr: 'src' },
        { selector: 'link[rel="stylesheet"]', attr: 'href' }
      ],
      ignoreError: true,
      maxDepth: 1
    };

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

      res.render('')
      res.json(`${webpageDirectoryPath}/index.html`);
    }).catch(err => {
      debugger;
      // res.end()
      return next(err);
    });

  } else if (webpagesFromDB.length > 0){
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

    res.json(`${webpageDirectoryPath}/index.html`);
  }
});

router.post('/web/update', async (req, res, next) => { //url validator 찾아보기
  const requestUrl = req.body.url;
  const isUserConfirmed = req.body.userConfirm;
  const webpageDirectoryPath = `./public/assets/${requestUrl}`;
  const fileExists = fs.existsSync(webpageDirectoryPath);

  if (fileExists) {
    del.sync(['public/assets/**', '!public/assets']);
  }

  const webpagesFromDB = await Webpage.find({ url: requestUrl }).lean();

  if (!webpagesFromDB.length && !isUserConfirmed) {
    return res.json({
      dataSaved: false,
      message: 'Data hasn\'t been stored in DB yet'
    });
  }

  const options = {
    urls: [`http://${requestUrl}`],
    directory: `./public/assets/${requestUrl}`,
    sources: [
      { selector: 'img', attr: 'src' },
      { selector: 'link[rel="stylesheet"]', attr: 'href' }
    ],
    ignoreError: true,
    maxDepth: 1
  };

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
      dataSaved: true,
      message: 'Data safely stored in DB'
    });
  }).catch(err => {
    debugger;
    return res.json({ message: 'The website doesn\'t exist', status: 404});
  });
});

module.exports = router;
