const express = require('express');
const scrape = require('website-scraper');
const fs = require('fs');
const router = express.Router();
const Webpage = require('../models/Webpage.js');
const Url = require('../models/Urls');
const del = require('del');
const cron = require('node-cron');
const axios = require('axios');

cron.schedule('0 0 10 * * Mon', async () => {
  const lists = await Url.find().lean();

  lists.forEach(({ url }) => {
    axios({
      method:'post',
      url: 'http://localhost:3000/api/web/update',
      data: {
        url: url
      }
    }).catch(err => next(err));
  });
});

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

setInterval( function(){ 
  const day = new Date().getDay();
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();

  if (day === 1 && hour === 10 && minute === 0) {
    
  }
} , 60 * 1000);

router.get('/web/search/:url/latest', async (req, res, next) => {
  const requestUrl = req.params.url;

  const webpageDirectoryPath = `./public/assets/${requestUrl}`;

  let fileExists = fs.existsSync(webpageDirectoryPath);

  if (fileExists) {
    del.sync(['public/assets/**', '!public/assets']);
    fileExists = false;
  }

  const webpages = await Webpage.find({ url: requestUrl }).lean();
  const latestPage = webpages[webpages.length - 1];

  if (!fileExists)  {
    createDirectoryFolders(webpageDirectoryPath);
  }

  createFiles(webpageDirectoryPath, latestPage);

  res.json({
    done: true,
    path: `/public/assets/${requestUrl}/index.html`
  });
});

router.get('/web/search/:url/:id', async (req, res, next) => {
  const targetId = req.params.id;
  const requestUrl = req.params.url;
  const webpageDirectoryPath = `./public/assets/${requestUrl}`;

  let fileExists = fs.existsSync(webpageDirectoryPath);

  const validation = await checkUrlValidation(requestUrl);

  if (!validation) {
    return res.json({ message: 'Invalid URL', status: 401 });
  }

  if (fileExists) {
    del.sync(['public/assets/**', '!public/assets']);
    fileExists = false;
  }

  const targetWebpage = await Webpage.findById({ _id: targetId }).lean();
  
  if (!fileExists) {
    createDirectoryFolders(webpageDirectoryPath);
  }

  createFiles(webpageDirectoryPath, targetWebpage);

  res.json({
    done: true
  });
});

router.get('/web/search/:url', async (req, res, next) => {
  const requestUrl = req.params.url;
  
  const webpages = await Webpage.find({ url: requestUrl }).lean();

  const timestamps = getUniqueTimestamps(webpages);

  res.json({ timestamps });
});

router.post('/web/search', async (req, res, next) => {
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

  if (!webpagesFromDB.length && !isUserConfirmed) {
    return res.json({
      isSaved: false,
      isSingleData: null,
      message: 'Data hasn\'t been stored in DB yet'
    });
  }

  if (!webpagesFromDB.length) {
    scrape(options).then((result) => { //origin url 사용 필요?
      const newPage = createNewPage(result[0], requestUrl);

      newPage.save(err => {
        if (err) return next(err);
      });

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
      createDirectoryFolders(webpageDirectoryPath);
    }

    createFiles(webpageDirectoryPath, webpage);

    res.json({
      isSaved: false,
      url: requestUrl,
      isSingleData: true
    });

  } else {
    res.json({
      isSaved: false,
      isSingleData: false,
      url: requestUrl
    });
  }
});

router.post('/web/update', async (req, res, next) => {
  const requestUrl = req.body.url;
  const webpageDirectoryPath = `./public/assets/${requestUrl}`;
  let fileExists = fs.existsSync(webpageDirectoryPath);

  options.urls = [`http://${requestUrl}`];
  options.directory = `./public/assets/${requestUrl}`;

  if (fileExists) {
    del.sync(['public/assets/**', '!public/assets']);
    fileExists = false;
  }

  scrape(options).then((result) => {
    const newPage = createNewPage(result[0], requestUrl);

    newPage.save(err => {
      if (err) return next(err);
    });

    Url.find({ url: requestUrl }).lean().exec((err, result) => {
      console.log(result);

      if (!result.length) {
        const newUrl = new Url({ url: requestUrl });

        newUrl.save(err => {
          if (err) return next(err);
        });
      }

      return;
    });

    res.json({
      url: requestUrl,
      message: 'Data safely stored in DB'
    });

  }).catch(err => {
    return res.json({ message: 'The website doesn\'t exist', status: 404});
  });
});

function getUniqueTimestamps(data) {
  const uniqueDate = {};

  data.forEach(webpage => {
    const stringISODate = webpage.createdAt.toISOString().slice(0, 10);

    if (!uniqueDate[stringISODate]) {
      webpage.createdAt = stringISODate;
      uniqueDate[stringISODate] = {
        id: webpage._id.toString(),
        date: webpage.createdAt,
        url: webpage.url
      };
    }
  });

  return Object.values(uniqueDate);
}

function createNewPage(data, url) {
  const { type, text, filename, children } = data;
  const cssFiles = children.filter(file => file.type === 'css');
  const imageFiles = children.filter(file => !file.type);

  return new Webpage({
    url: url,
    type: type,
    text: text,
    filename: filename,
    createdAt: new Date().toISOString(),
    css: cssFiles,
    images: imageFiles
  });
}

function createDirectoryFolders(path) {
  const cssPath = `${path}/css`;
  const fontsPath = `${path}/fonts`;
  const imagePath = `${path}/images`;

  fs.mkdirSync(path);
  fs.mkdirSync(cssPath);
  fs.mkdirSync(fontsPath);
  fs.mkdirSync(imagePath);
}

function createFiles(path, data) {
  fs.writeFileSync(`${path}/${data.filename}`, data.text);

  if (data.css.length) {
    data.css.forEach(css => {
      fs.writeFileSync(`${path}/${css.filename}`, css.text);
    });
  }

  if (data.images.length) {
    data.images.forEach(image => {
      fs.writeFileSync(`${path}/${image.filename}`, image.text, 'binary');
    });
  }
}

module.exports = router;
