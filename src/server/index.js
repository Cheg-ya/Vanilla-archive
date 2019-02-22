const express = require('express');
const api = require('./router/api');
const search = require('./router/search');
const mongoose = require('mongoose');

mongoose.connect('mongodb://admin_song:123123123@cluster0-shard-00-00-4hrjv.mongodb.net:27017,cluster0-shard-00-01-4hrjv.mongodb.net:27017,cluster0-shard-00-02-4hrjv.mongodb.net:27017/vanilla-archive?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected');
});

const app = express(); //에러핸들링 ejs로 할것

app.set('view engine', 'ejs');
app.set('views', 'views'); //경로 확인해볼것
app.use(express.static('dist'));
app.use(express.json());
app.use(express.static(__dirname + '../../public/assets'));
app.use('/api', api);
app.all('/search/:url', search);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
