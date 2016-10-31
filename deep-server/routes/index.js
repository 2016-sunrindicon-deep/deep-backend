var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if(req.session.nickname){
      res.redirect('chat');
    }else{
      res.render('login');
    }
});

router.get('/profile', function(req, res) {
    res.render('profile', {
        title: "NO.w.HERE",
        Country: req.session.country,
        Username: req.session.nickname
    });
});

router.get('/settings', function(req, res) {
  if(req.session.country === "no country"){
    res.render('settings', {
        title: "Settings",
        Country: 'no country',
        Username: req.session.nickname
    });
  }else{
    res.render('settings', {
        title: "Settings",
        Country: req.session.country,
        Username: req.session.nickname
    });
  }

});

router.get('/messages', function(req, res) {
    res.render('main', {
        title: "Settings",
        Country: req.session.country,
        Username: req.session.nickname
    });
});


module.exports = router;
