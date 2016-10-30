var express = require('express');
var router = express.Router();

router.get('/signup', function(req, res){
    req.redirect('http://iwin247.net:3000');
});

router.post('/login', function(req, res){

});

router.post('/signup', function(req, res){
     if(req.body.id_input != "" || req.body.login-pass != "" || req.body.login-mail != ""){
       console.log(req.body.id_input+ req.body.login-pass + req.body.login-mail);
       res.redirect('http://iwin247.net/');
     }else{
      
     }
});

module.exports = router;
