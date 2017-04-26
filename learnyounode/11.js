const http = require('http')
const fs = require('fs')
const [ , , port, file] = process.argv
const server = http.createServer( (req, res) => {
    res.writeHead(200, {'content-type': 'text/plain'})
  
    fs.createReadStream(file).pipe(res)
    
    // res.end()
})




server.listen(port)