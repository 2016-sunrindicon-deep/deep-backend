module.exports = chat;

function chat(app, db, rndstring) {
  app.post("/chat", async function(req, res) {
    var a = req.param("a");
    var b = req.param("b");
    var isFound = false;
    var foundEnd = false;
    var datas, datas2;

    var token = rndstring.generate(13);

    var user = await db.Users.findOne({
      user_id: a,
      talk: { $elemMatch: { id: b } }
    });

    if (user) {
      datas = user.talk;
    } else {
      datas = null;
    }

    if (datas == null) {
      console.log("datas is null");

      await db.Users.findOneAndUpdate(
        { user_id: a },
        { $push: { talk: { id: b, token: token } } },
        err => {
          if (err) console.log("DB Err", err);
          else console.log("usdate sucess!");
        }
      );

      var result = await db.Users.find({ user_id: a });
      console.log("talk: " + result[0].talk);
    } else {
      console.log(datas);
    }

    var userb = await db.Users.findOne({
      user_id: b,
      talk: { $elemMatch: { id: a } }
    });

    if (userb) {
      datas2 = userb.talk;
      console.log(datas2);
    } else {
      datas2 = null;
    }

    if (datas2 == null) {
      console.log("datas2 is null");
      //update
      await db.Users.findOneAndUpdate(
        { user_id: b },
        { $push: { talk: { id: a, token: token } } },
        async err => {
          if (err) console.log("DB Err", err);
          else console.log("usdate sucess!");

          var result = await db.Users.find({ user_id: b });
          for (data of result[0].talk) {
            if (data.id == a) {
              console.log("m Data " + data.token);
              token = data.token;
            }
          }
        }
      );
    } else {
      for (data of datas2) {
        if (data.id == a) {
          token = data.token;
        }
      }
    }
    console.log("token : ", token);
    res.send(token);
  });

  async function find(a, b) {
    var datas = await db.Users.findOne({
      user_id: a,
      talk: { $elemMatch: { id: b } }
    });

    if (datas) {
      id = datas.user_id;
    }

    console.log(id);
    var user = await db.Users.findOne({ user_id: id });
    (err, token) => {
      console.log("err : ", err);
      if (err != null) {
        //token update필요
        console.log("Not found Data! update start");
        db.Users.findOneAndUpdate(
          { user_id: a },
          { $push: { talk: { id: b, token: token } } },
          err => {
            if (err) console.log("DB Err");
            else console.log("update sucess!");
          }
        );
      } else {
        console.log("token2 : ", token);
      }
    };
  }
}
