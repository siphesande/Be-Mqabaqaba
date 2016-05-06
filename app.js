'use strict';

var express = require('express'),
    exphbs  = require('express-handlebars'),
    mysql = require('mysql'),//node-mysql module
    myConnection = require('express-myconnection'),//express-my connection module
    bodyParser = require('body-parser');
    //challenge = require('./routes/challenges'),
    //posts =require("./routes/posts")

var user = require('./routes/user');

var app = express();

var dbOptions = {
      host: 'localhost',
      user: 'root',
      password: '08386354',
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
  res.redirect('/user/1');
});

// app.get('/home', function(req,res){
//     res.render('home');
// });
//app.post("/giveChallenge", challenge.giveChallenge ),

app.get('/user/:userID', user.showChallenges);
app.get('/user/:userID/challenge/complete', user.updateStatus);
app.get('/user/:userID/challenge/cancel', user.cancel);
app.get('/user/:userID/challenge/add',function(req,res){
  res.render('add-challenge');
});

app.get('/user/:userID/reset', user.reset);

app.post('/user/:userID/challenge/add/success', user.addChallenge);


//configure the port number using and environment number
var portNumber = process.env.CRUD_PORT_NR || 8080;

//start everything up
app.listen(portNumber, function (){
console.log('app server listening on:', portNumber);
});
