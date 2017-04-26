const fs = require('fs')
const dir = process.argv[2]
const ext = '.' + process.argv[3]

fs.readdir(dir, (err, list) => {
   list
   .filter((val) => val.includes(ext))
   .forEach((val) => console.log(val))
})
