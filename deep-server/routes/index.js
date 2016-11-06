var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    if (req.session.nickname) {
        res.redirect('messages');
    } else {
        res.render('login');
    }
});

router.get('/profile', function(req, res) {
    if (req.session.nickname) {
        res.render('profile', {
            title: "NO.w.HERE",
            Country: req.session.country,
            Username: req.session.nickname
        });
    } else {
        res.redirect('http://iwin247.net:7727');
    }
});


router.get('/home', function(req, res) {
    if (req.session.nickname) {
        res.render('home', {
            title: "NO.w.HERE",
            Country: req.session.country,
            Username: req.session.nickname
        });
    } else {
        res.redirect('http://iwin247.net:7727');
    }
});

router.get('/settings', function(req, res) {
    if (req.session.nickname) {
        if (req.session.country === "no country") {
            res.render('settings', {
                title: "Settings",
                Country: 'no country',
                Username: req.session.nickname
            });
        } else {
            res.render('settings', {
                title: "Settings",
                Country: req.session.country,
                Username: req.session.nickname
            });
        }
    } else {
        res.redirect('http://iwin247.net:7727');
    }

});

router.get('/messages', function(req, res) {
    if (req.session.nickname) {
        if (req.session.country === "no country") {
            res.render('main', {
                title: "Settings",
                Country: 'no country',
                Username: req.session.nickname
            });
        } else {
            res.render('main', {
                title: "Settings",
                Country: req.session.country,
                Username: req.session.nickname
            });
        }

    } else {
        res.redirect('http://iwin247.net:7727');
    }
});


module.exports = router;
