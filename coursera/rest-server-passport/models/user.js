var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  OauthId: String,
  OauthToken: String,
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  admin: {
    type: Boolean,
    default: false
  },
},{
  collection: 'Users'
});

User.methods.getName = function () {
  return (this.firstname + '' + this.lastname);
}

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', User);
