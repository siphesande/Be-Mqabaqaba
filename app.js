'use strict';

var express = require('express'),
    exphbs  = require('express-handlebars'),
    mysql = require('mysql'),//node-mysql module
    myConnection = require('express-myconnection'),//express-my connection module
    bodyParser = require('body-parser');
    //challenge = require('./routes/challenges'),
    //posts =require("./routes/posts")


var app = express();

var dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '1amdan13l',
      port: 3306,
      database: 'mqabaqaba'
};

//setup template handlebars as the template engine
app.set('views',__dirname + '/views');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

//setup middleware

app.use(myConnection(mysql, dbOptions, 'single'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// function errorHandler(err, req, res, next) {
//   res.status(500);
//   res.render('error', { error: err });
// }
//
// app.use(errorHandler);

//setup the handlers
app.get('/', function (req, res) {
  res.render('home');
});

//app.post("/giveChallenge", challenge.giveChallenge ),


//configure the port number using and environment number
var portNumber = process.env.CRUD_PORT_NR || 3002;

//start everything up
app.listen(portNumber, function (){
console.log('app server listening on:', portNumber);
});
