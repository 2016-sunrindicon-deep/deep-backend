var async = require('async');

module.exports = chat;

function chat(app, db, rndstring){


app.post('/chat', function(req,res){
  console.log('asdf')
  var a = req.param('a');
  var b = req.param('b');
  var isFound = false;
  var foundEnd = false;

  var token = rndstring.generate(13);

  var promise1 = db.Users.find({"user_id": a, "talk" : {$elemMatch : {"id" : b}}}).exec();
  promise1.then(function(user){
    // console.log(user);
    if(user.length > 0){
      return user[0].talk
    }else{
      return null;
    }
  }).then(function(datas) {
      if(datas == null){
        console.log("datas is null");
        db.Users.findOneAndUpdate({"user_id": a}, {$push : {talk : { "id" : b, "token" : token}}},(err) => {
              if(err) console.log("DB Err",err);
              else console.log("usdate sucess!");
            });
        db.Users.find({"user_id" : a},function(err, result) {
          console.log("talk: "+result[0].talk);
        })
      }else{
        console.log(datas);
      }
  })

  var promise2 = db.Users.find({"user_id": b, "talk" : {$elemMatch : {"id" : a}}}).exec();
  promise2.then(function(user){
    // console.log(user);
    if(user.length > 0){
      return user[0].talk
    }else{
      return null;
    }
  }).then(function(datas) {
      if(datas == null){
        console.log("datas is null");
        //update
        return db.Users.findOneAndUpdate({"user_id": b}, {$push : {talk : { "id" : a, "token" : token}}},(err) => {
              if(err) console.log("DB Err",err);
              else console.log("usdate sucess!");
              return db.Users.find({"user_id" : b},function(err, result) {
                for(data of result[0].talk){
                  if(data.id == a){
                    console.log("m Data " + data.token);
                    return data.token
                  }
                }
              })
        });

      }else{
        for(data of datas){
          if(data.id == a){
            return data.token
          }
        }
      }
  }).then(function(token) {
    console.log("token : ",token);
    res.send(token)
  })
});

function find(a,b) {
  async.waterfall([
    function(callback) {
      db.Users.find({"user_id": a, "talk" : {$elemMatch : {"id" : b}}}).exec( (err,datas) => {
        // console.log(user);
        // console.log(datas.talk);
        if(datas.length > 0){
          callback(null, datas.user_id);
        }else{
          callback("update","hello");
        }
      });
    },
    function(id, callback){
      // console.log("data found!", datas);
      console.log(id);
      db.Users.findOne({"user_id" : id},(err, user)=>{
        if(err){
          console.log("DB err", err);
        }
        if(user){
          console.log(user.talk);
        }
      })
      // console.log(datas.user_id);
      // for(data of datas){
      //   // console.log(data,"   ", b);
      //   if(data.id == b){
      //     console.log(data.token);
      //     callback(null, data.token)
      //   }
      // }
    }
  ],(err, token) => {
    console.log("err : ", err);
    if(err != null){
      //token update필요
      console.log("Not found Data! update start");
      db.Users.findOneAndUpdate({"user_id": a}, {$push : {talk : { "id" : b, "token" : token}}},(err) => {
        if(err) console.log("DB Err");
        else console.log("update sucess!");
      });
    }else{
      console.log("token : ",token);
    }
  });
}
}

