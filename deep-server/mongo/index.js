var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://localhost/testdeep");

var talkSchema = new mongoose.Schema(
  {
    id: { type: String },
    token: { type: String }
  },
  { _id: false }
);

var UserSchema = new mongoose.Schema({
  id: { type: Number },
  token: { type: String },
  user_id: { type: String, required: true, sparse: true, unique: true },
  pw: { type: String, required: true },
  email: { type: String },
  Country: { type: String, default: "ko" },
  img_url: {
    type: String,
    default: "http://iwin247.net:7727/img/user/default"
  },
  firends: [String],
  talk: [talkSchema],
  hashs: [String]
});

var ChatSchema = new mongoose.Schema({
  id: { type: String },
  des: [String]
});

var Users = mongoose.model("users", UserSchema);
var Chats = mongoose.model("chats", ChatSchema);
var Talk = mongoose.model("talks", talkSchema);

exports.Users = Users;
exports.db = db;
exports.Chats = Chats;
exports.Talk = Talk;
