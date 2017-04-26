'use strict'
const http = require('http')
const url = process.argv[2]
const bl = require('bl')

http.get(url, (res) => {
    res.setEncoding('utf8')
    
    res.pipe(bl(function (err, data) {
        if (err) {
          return console.error(err)
        }
        data = data.toString()
        console.log(data.length)
        console.log(data)
    }))
    
    
    res.on('error', console.error)
}).on('error', console.error)