module.exports = img;

function img(app) {
   app.get('/img/user/:img', function(req, res) {
     res.sendFile("/home/june/server/deep-backend/deep-server/upload/user/"+req.params.img+".png");
   });
}
