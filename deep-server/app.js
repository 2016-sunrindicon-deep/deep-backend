var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var session = require('express-session');
var sessionstore = require('sessionstore');
var store = sessionstore.createSessionStore();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testdeep');
mongoose.Promise = require('bluebird');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var chat = require('./routes/chat');


var app = express();
var talkSchema = new mongoose.Schema({
    id : {type : String},
    token : {type : String},
},{_id : false})

var UserSchema = new mongoose.Schema({
    id:{type: Number},
    token:{type: String},
    user_id:{type: String, required: true, sparse: true, unique: true },
    pw:{type: String, required: true},
    email:{type: String},
    Country: {type: String, default: "ko"},
    tag: [String],
    img_url: {type: String, default: "http://iwin247.net:7727/img/user/default"},
    firends: [String],
    talk : [talkSchema]
});


var ChatSchema = new mongoose.Schema({
  id : {type : String},
  des : [String]
});


Users = mongoose.model('users', UserSchema);
Chats = mongoose.model('chats', ChatSchema);
Talk = mongoose.model('talks', talkSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( session( { store: store, secret: '앙기모띠', saveUninitialized: true}));

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/chat', chat);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
