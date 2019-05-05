const express = require('express');
const api = require('./router/api');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://guest:123123123@cluster0-4hrjv.mongodb.net/vanilla-archive', { useNewUrlParser: true });

const db = mongoose.connection;

db.once('open', () => {
  console.log('DB connected');
});

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(express.static(__dirname + '../../public/assets'));
app.use('/api', api);

app.listen(process.env.PORT || 8080);
