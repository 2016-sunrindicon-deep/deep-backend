var port = 7727;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var rndomstring = require('randomstring');
var session = require('express-session');
var sessionstore = require('sessionstore');
var store = sessionstore.createSessionStore();
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./mongo');

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


require('./routes/index')(app, db);
require('./routes/auth')(app, db, rndomstring);
require('./routes/chat')(app, db);


/**
 * ADDED!! Socket.IO Connection.
 */
var users = []; //현재 접속중인 유저 저장 배열
var usernum = 0; //현재 접속중인 유저 수s

app.post('/users', function(req, res){
  req.send('asdf');
});

io.on('connection', function(socket) {
            var addedUser;
            var room_id; //현재 접속중 룸 아이디 default = main(메인에서는 다같이있어요)

            //add User
            socket.on('addUser', (data) => {
                if (addedUser) return;
                var inUser = false;
                addedUser = true;
                console.log('a user connection : ' + data.name);
                socket.user_id = data.name; //유저 이름
                console.log(socket.user_id);
                socket.join("mamin");
                room_id = data;

                db.Users.findOne({
                    user_id: socket.user_id
                }, (err, result) => {
                    if (err) {
                        console.log("DB Find Err");
                        throw err;
                    }

                    for (var i = 0; i < users.length; i++) {
                        if (users[i].user_id == result.user_id) {
                            inUser = true;
                            break;
                        }
                    }

                    if (result) {
                        console.log(result);
                        if (!inUser) {
                            users.push(result); //유저 배열 업뎃
                            usernum++;
                        }
                        io.emit('user state', {
                            users: users,
                            nickname: result.user_id
                        });
                    } else {
                        console.log("no user!");
                    }
                });
            });

            //disconnet event
            socket.on('disconnect', () => {
                // console.log(users.indexOf({ name : socket.username }));
                if (addedUser) {
                    for (var i in users) {
                        if (users[i].user_id == socket.user_id) {
                            users.splice(i, 1);
                            break;
                        }
                    }
                    socket.leave(room_id);
                    console.log('user disconnect : ' + socket.user_id);

                    if (--usernum < 0) usernum = 0;
                    console.log(users);
                    //유저 스태이트 업뎃
                    io.emit('left', {
                        nickname: socket.user_id,
                        users: users
                    });
                }
            });

            //message event
            socket.on('chat message', function(data) {
                var chat = new db.Chats({
                    id: room_id,
                })
                db.Users.findOne({
                    "user_id": socket.user_id
                }).exec().then(function(user) {
                    console.log(user.Country);
                    if (user.Country == "ko") {
                        console.log("*** My Country is ko ***");
                        async.waterfall([
                            function(callback) {
                                console.log("1.text To En");
                                unirest.post('https://openapi.naver.com/v1/language/translate')
                                    .headers({
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'X-Naver-Client-Id': 'VAdnehFul6TcOL1mFpRP',
                                        'X-Naver-Client-Secret': 'uPlTIn2yI6'
                                    })
                                    .send('source=ko')
                                    .send('target=en')
                                    .send('text=' + data.msg)
                                    .end(function(res) {
                                        callback(null, res.body.message.result.translatedText);
                                    });
                            },
                            function(text, callback) {
                                console.log("2. save text");
                                db.Chats.findOne({
                                    id: room_id
                                }, (err, result) => {
                                    if (err) {
                                        console.log("DB err");
                                        throw err;
                                    }
                                    if (result) {
                                        result.des.push(data.user + " : " + text);
                                        result.save((err) => {
                                            if (err) {
                                                console.log("DB err");
                                                throw err;
                                            }
                                        });
                                    } else {
                                        chat.des.push(data.user + " : " + text);
                                        chat.save((err) => {
                                            if (err) {
                                                console.log("DB save err");
                                                throw err;
                                            } else {
                                                console.log("Saved Okay");
                                            }
                                        });
                                    }
                                });
                                callback(null, text)
                            },
                            function(text, callback) {
                                console.log("3.find target id");
                                // console.log("my room id : ", room_id);
                                var promise = db.Users.find({
                                    "talk": {
                                        $elemMatch: {
                                            "token": room_id
                                        }
                                    }
                                }).select({
                                    "user_id": true,
                                    "_id": false
                                }).exec()
                                promise.then(function(users) {
                                    for (user of users) {
                                        if (user.user_id != socket.user_id) {
                                            // console.log("!!!",user.user_id);
                                            callback(null, user.user_id);
                                        }
                                    }
                                })
                            },
                            function(tID, callback) {
                                console.log(" == ", tID);
                                var pro = db.Users.findOne({
                                    "user_id": tID
                                }).exec()
                                pro.then(function(tUser) {
                                    // console.log(tUser);
                                    if (tUser.Country != "ko") {
                                        unirest.post('https://openapi.naver.com/v1/language/translate')
                                            .headers({
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'X-Naver-Client-Id': 'VAdnehFul6TcOL1mFpRP',
                                                'X-Naver-Client-Secret': 'uPlTIn2yI6'
                                            })
                                            .send('source=ko')
                                            .send('target=' + tUser.Country)
                                            .send('text=' + data.msg)
                                            .end(function(res) {
                                                callback(null, res.body.message.result.translatedText);
                                            });
                                    } else {
                                        callback(null, data.msg)
                                    }
                                })
                            },
                            function(tText, callback) {
                                console.log("4.Send text To target");
                                socket.broadcast.to(room_id).emit('chat message', {
                                    msg: tText,
                                    name: data.user
                                })
                                callback("end")
                            }
                        ], function(err, result) {
                            console.log('5.Send Text To me');
                            socket.emit('my message', data.user + " : " + data.msg)
                        })
                    }
                })
            });

            //change room
            socket.on('change room', (data) => {
                    console.log(data);
                    if (room_id) socket.leave(room_id);
                    socket.join(data);
                    room_id = data;
                    db.Chats.findOne({
                            id: data
                        }, (err, result) => {
                            if (err) {
                                console.log("DB err");
                                throw err;
                            }
                            if (result) {
                                var tmp = [];
                                for (var i = 0; i < result.des.length; i++) {
                                    if (result.des[i].toString().split(":")[0] == socket.user_id) {
                                      tmp.push(result.des[i])
                                    } else {
                                        unirest.post('https://openapi.naver.com/v1/language/translate')
                                           .headers({
                                                'Content-Type': 'application/x-www-form-urlencoded',
                                                'X-Naver-Client-Id': 'VAdnehFul6TcOL1mFpRP',
                                                'X-Naver-Client-Secret': 'uPlTIn2yI6'
                                            })
                                            .send('source=en')
                                            .send('target=ko')
                                            .send('text=' + result.des[i].split(":")[1])
                                            .end(function(res) {
                                                //tmp.push(result.des[i].toString().split(":")[0]+":"+res.body.message.result.translatedText);
                                                console.log(result.des[i]);
                                            });
                                    }
                                }
                                socket.emit('loading message', {des: tmp});
                                console.log("join! :", room_id);
                              }
                            });
                    });
            });


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

http.listen(port, function(){
    console.log('Safood Server running on Port ' + port);
});
