var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('login.ejs', {});
});

router.get('/profile', function(req, res) {
    res.render('profile.ejs', {
        title: "NO.w.HERE",
        Country: 'korea',
        Username: db[db.length - 1].id
    });
});
router.get('/settings', function(req, res) {
    res.render('settings.ejs', {
        title: "Settings",
        Country: 'korea',
        Username: db[db.length - 1].id
    });
});
router.get('/messages', function(req, res) {
    res.render('main.ejs', {
        title: "Settings",
        Country: 'korea',
        Username: db[db.length - 1].id
    });
});


module.exports = router;
