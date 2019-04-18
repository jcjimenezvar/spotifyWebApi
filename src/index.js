//imports
const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const path = require('path');
const morgan = require('morgan');

// Create server
const app = express()

//Importing routes
const indexRoutes = require('./routes/index');


//settings
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('public', path.join(__dirname, '/public'));
app.set('view engine', 'hbs');

//Routes

app.use('/', indexRoutes);
app.use('/home', indexRoutes);
app.use('/search', indexRoutes);

//middleware
app.use(morgan('dev'));
app.use(express.urlencoded({
  extended: false
}));

//database

mongoose.connect('mongodb://localhost:27017/spotify', { useNewUrlParser: true })
  .then(db => console.log('Db conected')).catch(err => console.log(err))

//Start of server
app.listen(app.get('port'), () => {
  console.log(`Server listening port: ${app.get('port')}`);
})