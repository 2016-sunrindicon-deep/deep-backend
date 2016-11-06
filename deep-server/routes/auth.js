var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('asdf');
});

router.post('/setting', function(req, res){
    var country = req.param('country');
    var user_id = req.param('user_id');
    console.log("강은솔"+user_id + country);
    Users.update({user_id: user_id}, {$set: {Country: country}}, (err, result) => {
      if(err) ;
      Users.findOne({user_id: user_id}, (err, users) => {
        if(result) return res.send(users);
      });
    });
});

router.post('/login', function(req, res) {
    if (req.body.id_input === "" || req.body.pw_input === "") {
        res.redirect('/');
    } else {
        Users.findOne({"user_id": req.body.id_input, "pw": req.body.pw_input}, function(err, member) {
            if (member) {
                    req.session.nickname = member.user_id;
                    req.session.country = member.Country
                    name = member.user_id;
                    console.log(name + "님 로그인하셨습니다");
                    res.redirect('/messages');
            }else{
              res.redirect('/');
            }
        });
    }
});

router.post('/signup', function(req, res) {
    console.log(req.body);
    if (req.body.id_input === "" || req.body.pw_input === "" || req.body.mail_input === "") {
        console.log("asdf");
        //res.redirect('/');
    } else {
       var user_id = req.body.id_input;
       var email = req.body.mail_input;
       var pw = req.body.pw_input;


        var current = new Users({
            user_id: user_id,
            email: email,
            pw: pw,
        });

        current.save(function(err) {
            if (err) { // TODO handle the error
                console.log("dd");
                console.log(err);
                //res.redirect('/')
            } else {
              req.session.nickname = current.user_id;
              req.session.country = current.Country;
                res.redirect('/settings');
            }
        });
    }
});

module.exports = router;
