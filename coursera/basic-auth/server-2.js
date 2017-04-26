var express = require ('express')
var morgan = require ('morgan')
var cookieParser = require('cookie-parser')

var hostname = 'localhost'
var port = 3000

var app = express()
// server side log, what was done on the server
app.use(morgan('dev'))

// secret key
app.use(cookieParser('12345-67890-09876-54321'));

function auth (req, res, next) {
  if (!req.signedCookies.signed_user) {
    console.log('目前沒有cookies');
    var authHeader = req.headers.authorization
    if (!authHeader) {
      var err = new Error ('You are not authenticated!')
      err.status = 401
      next (err)
      // 沒有輸入帳密，直接跳出整個function
      return
    }

    var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':')
    var user = auth[0]
    var pass = auth[1]
    if (user == 'admin' && pass == 'password') {
      // res.cookie(name, value [, options])
      // Simply include the signed option set to true.
      // Then res.cookie() will use the secret passed to cookieParser(secret) to sign the value.
      // res.cookie('user','admin',{signed: true})
      // res.cookie('user','admin')
      res.cookie('signed_user','admin',{signed: true})
      next(); //authorized 可以過了
    } else {
      var err = new Error ('You shall not pass!')
      err.status = 401
      next(err)
    }
  } else {
    console.log('有cookies的狀態\n',req.headers);
    if (req.signedCookies.signed_user === 'admin') {
      next(); //authorized 可以過了
    } else {
      var err = new Error('You are not admin!')
      err.status = 401
      next (err)
    }
  }
}

// Authentication Middleware
app.use(auth)

// Serving Static Files
app.use(express.static(__dirname+ '/public'));

// Error handler
app.use(function(err, req, res, next) {
  res.writeHead(err.status || 500, {
    'WWW-Authenticate': 'Basic',
    'Content-Type': 'text/plain'
  });
  res.end(err.message)
})

app.listen(port, hostname, function (){
  console.log(`Server running at http://${hostname}:${port}/`)
})
