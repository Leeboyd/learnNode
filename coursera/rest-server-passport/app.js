var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    passport = require('passport');

// var LocalStrategy = require('passport-local').Strategy;


//Configuration
var config = require('./config'),
    authenticate = require('./authenticate');

// Connect to the server
var mongoose = require('mongoose');
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  // we're connected!
  console.log("Connected correctly to server");
});

//Routers
var routes = require('./routes/index'),
    users = require('./routes/users'),
    dishRouter = require('./routes/dishRouter'),
    promoRouter = require('./routes/promoRouter'),
    leaderRouter = require('./routes/leaderRouter');
    favorRouter = require('./routes/favorRouter');

var app = express();

//Secure traffic only
app.all('*', function (req, res, next) {
  console.log('req start: ',req.secure, req.hostname, req.url, app.get('port'));
  if (req.secure) {
    return next();
  };
  res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
});

//view engine setup
app.set('views' ,path.join(__dirname, 'views'))
app.set('view engine', 'jade')

//Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

// Passport config
// var User = require('./models/user');
app.use(passport.initialize());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//靜態檔案位置
app.use(express.static(path.join(__dirname, 'public')));

//mount Routers
app.use('/', routes);
app.use('/users', users);
app.use('/dishes', dishRouter);
app.use('/promo', promoRouter);
app.use('/leader', leaderRouter);
app.use('/favorites', favorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     console.log(err);
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {
      status: err.status
    }
  });
});

module.exports = app;
