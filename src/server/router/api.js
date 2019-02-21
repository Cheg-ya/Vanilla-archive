const express = require('express');
const scrape = require('website-scraper');
const fs = require('fs');
const router = express.Router();
const Webpage = require('../models/Webpage.js');
const del = require('del');

router.post('/web', async (req, res, next) => { //중복요청 블럭
  const requestUrl = req.body.url;
  // debugger;
  del.sync(['public/assets', '!public']);

  const webpagesFromDB = await Webpage.find({ url: requestUrl }).lean();
  // debugger;
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

    scrape(options).then((result) => {
      const { type, text, filename, children } = result[0];
      // debugger
      const cssFiles = children.filter(file => file.type === 'css');
      const imageFiles = children.filter(file => !file.type);

      const newPage = new Webpage({
        url: requestUrl,
        type: type,
        text: text,
        filename: filename,
        timestamp: new Date(),
        css: cssFiles,
        images: imageFiles
      });

      newPage.save(err => {
        if (err) return next(err);
      });

      res.render('')
      res.json(`./public/assets/index.html`);
    }).catch(err => next(err));

  } else if (webpagesFromDB.length === 1){
    const webpage = webpagesFromDB[0];
    const webpageDirectoryPath = `./public/assets`;

    if (!fs.existsSync(webpageDirectoryPath)) {
      fs.mkdirSync(webpageDirectoryPath);
      fs.mkdirSync(`${webpageDirectoryPath}/css`);
      fs.mkdirSync(`${webpageDirectoryPath}/images`);
      fs.mkdirSync(`${webpageDirectoryPath}/fonts`);
    }

    fs.writeFileSync(`${webpageDirectoryPath}/${webpage.filename}`, webpage.text);

    if (webpage.css) {
      webpage.css.forEach(css => {
        fs.writeFileSync(`${webpageDirectoryPath}/${css.filename}`, css.text);
      });
    }

    if (webpage.images) {
      webpage.images.forEach(image => {
        fs.writeFileSync(`${webpageDirectoryPath}/${image.filename}`, image.text, 'binary');
      });
    }
    debugger;
    // res.render('index.html', { root: './public/assets' });
    res.json(`${webpageDirectoryPath}/index.html`);
  }
});

module.exports = router;
