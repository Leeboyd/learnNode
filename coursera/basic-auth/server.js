var express = require ('express')
var morgan = require ('morgan')
var hostname = 'localhost'
var port = 3000

var app = express()
// server side log, what was done on the server
app.use(morgan('dev'))

function auth (req, res, next) {
  console.log(req.headers);
  var authHeader = req.headers.authorization
  if (!authHeader) {
    var err = new Error('You are not authenticated')
    err.status = 401
    next(err)
    return
  }

  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':')
  // req.headers.authorization: "Basic YWRtaW46cGFzc3dvcmQ=",
  // 分割字串取[1] .split(' ')[1]     結果："YWRtaW46cGFzc3dvcmQ="
  // 呼叫 atob() 功能：Decodes a string of data which has been encoded using base-64 encoding.
  // atob("YWRtaW46cGFzc3dvcmQ=")   結果："admin:password"
  var user = auth[0]
  var pass = auth[1]
  if (user == 'admin' && pass == 'password') {
    next(); //authorized 可以過了
  } else {
    var err = new Error ('You shall not pass!')
    err.status = 401
    next(err)
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
