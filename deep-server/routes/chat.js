var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if (req.session.nickname) {
        res.render('chat', {
            title: "NO.w.HERE",
            Country: 'korea',
            Username: req.session.nickname
        });
    }else{
      res.redirect('http://iwin247.net:6974/');
    }
});

module.exports = router;
