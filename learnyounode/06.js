const read = require('./readfile.js')
const cb = (err, data) => {
    if (err) {
        console.log(err)
    } else {
       data.forEach((val) => console.log(val))
    }
    
    
} 
read(process.argv[2], process.argv[3], cb)