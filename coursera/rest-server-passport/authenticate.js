var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var config = require('./config');

// add Facebook strategy
var FacebookStrategy = require('passport-facebook').Strategy;

exports.local = passport.use(new LocalStrategy(User.authenticate()));
// What is User.serializeUser() ?
// function (user, cb) {
//     cb(null, user.get(options.usernameField));
// }
passport.serializeUser(User.serializeUser());
// What is User.deserializeUser() ?
// function (username, cb) {
//     self.findByUsername(username, cb);
// }
passport.deserializeUser(User.deserializeUser());

exports.facebook = passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  // facebook will send back the token and profile
  function(accessToken, refreshToken, profile, done) {
    // check what's inside profile
    console.dir(profile);
    User.findOne({ OauthId: profile.id }, function (err, user) {
      if (err) {
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        console.log(err);
        return done(err);
      }
      if (!err && user !== null) {
        // user found in our datbase.
        done(null, user);
      } else {
        console.log('Otherwise we are going to register a new user.');
        user = new User({
          username: profile.displayName
        });
        user.OauthId = profile.id;
        user.OauthToken = accessToken;
        user.save(function (err) {
          if (err) {
            console.log(err);
            // dosomething about err
          } else {
            console.log('registering user ...');
            done (null, user);
          }
        });
      }
    });
  }
));
