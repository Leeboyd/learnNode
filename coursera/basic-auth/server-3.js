var express = require ('express'),
    morgan = require ('morgan'),
    session = require ('express-session')
var FileStore = require ('session-file-store')(session)

var hostname = 'localhost'
var port = 3000

var app = express()

// server side log, what was done on the server
app.use(morgan('dev'))

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}))

function auth (req, res, next) {
  if (!req.session.user) {
    console.log('目前沒有session');
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
      console.log('狀態1\nreq.session:\n',req.session);
      req.session.user = 'admin'
      console.log('狀態2\nreq.session:\n',req.session);
      next(); //authorized 可以過了
    } else {
      var err = new Error ('You shall not pass!')
      err.status = 401
      next(err)
    }
  } else {
    if (req.session.user === 'admin') {
      console.log('有session的狀態\nreq.session:\n',req.session);
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
