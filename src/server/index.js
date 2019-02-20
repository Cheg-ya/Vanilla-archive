const express = require('express');
const api = require('./router/api');
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

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use('/static', express.static(__dirname + '/public'));
app.use('/api', api);

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
