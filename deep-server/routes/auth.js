var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('asdf');
});

router.get('/signup', function(req, res) {
    res.redirect('http://iwin247.net:6974');
});

router.post('/login', function(req, res) {
    if (req.body.id_input === "" || req.body.pw_input === "") {
        res.redirect('/');
    } else {
        Users.findOne({"user_id": req.body.id_input, "pw": req.body.pw_input}, function(err, member) {
            if (member) {
                req.session.regenerate(function() {
                    req.session.nickname = member.user_id;
                    req.session.country = member.Country
                    name = member.user_id;
                    console.log(name + "님 로그인하셨습니다");
                    res.redirect('/chat');
                });
            }else{
              res.redirect('/');
            }
        });
    }
});

router.post('/signup', function(req, res) {
    if (req.body.id_input === "" || req.body.pw_input === "" || req.body.mail_input === "") {
        res.redirect('/');
    } else {
       var user_id = req.body.id_input;
       var email = req.body.mail_input;
       var pw = req.body.pw_input;


        var current = new Users({
            user_id: user_id,
            email: email,
            pw: pw,
        });

        current.save(function(err, data) {
            if (err) { // TODO handle the error
                console.log("dd");
                res.redirect('/')
            } else {
                console.log("asd");
                res.redirect('/settings');
            }
        });
    }
});

module.exports = router;
