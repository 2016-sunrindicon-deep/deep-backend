module.exports = index;

var Q = require("q");
var multer = require("multer");

function index(app, db) {
  var upload = async function(req, res) {
    var deferred = Q.defer();

    var user = await db.users.findOne({ email: req.session.email });

    var storage = multer.diskStorage({
      // 서버에 저장할 폴더
      destination: function(req, file, cb) {
        cb(null, "upload/user");
      },

      // 서버에 저장할 파일 명
      filename: function(req, file, cb) {
        file.uploadedFile = {
          name: user.token,
          ext: "png"
        };

        cb(null, file.uploadedFile.name + "." + file.uploadedFile.ext);
      }
    });

    var upload = multer({
      storage: storage
    }).single("file");
    upload(req, res, async function(err) {
      if (err) {
        deferred.reject();
      } else if (req.file === undefined) {
        console.log(req.body);

        await db.Users.update(
          { id: req.body.user_id },
          { $set: { country: req.body.country } }
        );
      } else {
        deferred.resolve(req.file.uploadedFile);
      }
    });
    return deferred.promise;
  };

  app.get("/", function(req, res) {
    if (req.session.nickname) {
      res.redirect("messages");
    } else {
      res.render("login");
    }
  });

  app.get("/profile", function(req, res) {
    if (req.session.nickname) {
      db.Users.findOne(
        {
          email: req.session.email
        },
        function(err, users) {
          if (err) throw err;
          if (users) {
            res.render("profile", {
              title: "NO.w.HERE",
              Country: req.session.country,
              Username: req.session.nickname,
              img_url: users.img_url
            });
          }
        }
      );
    } else {
      res.redirect("http://iwin247.net:7727");
    }
  });

  app.get("/home", function(req, res) {
    if (req.session.nickname) {
      db.Users.findOne(
        {
          email: req.session.email
        },
        function(err, users) {
          if (err) res.redirect("/");
          if (users) {
            db.Users.find({}, function(err, alluser) {
              if (alluser) {
                res.render("home", {
                  title: "NO.w.HERE",
                  Country: req.session.country,
                  Username: req.session.nickname,
                  img_url: users.img_url,
                  a_users: alluser
                });
              }
            });
          } else {
            db.Users.find({}, function(err, alluser) {
              if (alluser) {
                res.render("home", {
                  title: "NO.w.HERE",
                  Country: req.session.country,
                  Username: req.session.nickname,
                  img_url: users.img_url,
                  a_users: "no user"
                });
              }
            });
          }
        }
      );
    } else {
      res.redirect("http://iwin247.net:7727");
    }
  });

  app.get("/settings", async function(req, res) {
    if (req.session.nickname) {
      var users = await db.Users.findOne({
        email: req.session.email
      });
      if (req.session.country === "no country") {
        res.render("settings", {
          title: "Settings",
          Country: "no country",
          Username: req.session.nickname,
          email: req.session.email,
          img_url: users.img_url
        });
      } else {
        res.render("settings", {
          title: "Settings",
          Country: req.session.country,
          Username: req.session.nickname,
          email: req.session.email,
          img_url: users.img_url
        });
      }
    } else {
      res.redirect("http://iwin247.net:7727");
    }
  });

  app.get("/messages", function(req, res) {
    if (req.session.nickname) {
      db.Users.findOne(
        {
          email: req.session.email
        },
        function(err, users) {
          if (err) throw err;
          if (req.session.country === "no country") {
            res.render("main", {
              title: "Settings",
              Country: "no country",
              Username: req.session.nickname,
              img_url: users.img_url
            });
          } else {
            res.render("main", {
              title: "Settings",
              Country: req.session.country,
              Username: req.session.nickname,
              img_url: users.img_url
            });
          }
        }
      );
    } else {
      res.redirect("http://iwin247.net:7727");
    }
  });

  app.post("/setPro", function(req, res) {
    upload(req, res).then(
      function(file) {
        db.Users.update(
          {
            email: req.session.email
          },
          {
            $set: {
              img_url: "http://iwin247.net:7727/img/user/" + users.token
            }
          },
          function(err, result) {
            res.redirect("http://iwin247.net:7727/");
          }
        );
      },
      function(err) {
        if (err) res.redirect("http://iwin247.net:7727/settings");
      }
    );
  });

  app.post("/hobby", (req, res) => {
    var hobby = req.param("hobby[]");
    db.Users.update(
      { email: req.session.email },
      { $set: { hashs: hobby } },
      function(err, result) {
        if (result) res.sendStatus(200);
      }
    );
  });

  app.post("/lang", (req, res) => {
    var country = req.body.country;

    db.Users.update(
      { email: req.session.email },
      { $set: { country: country } },
      function(err, result) {
        if (result) res.sendStatus(200);
      }
    );
  });
}
