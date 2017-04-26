const fs = require('fs')

const contents = fs.readFileSync(process.argv[2], 'utf8')

const lines = contents.split('\n')

console.log(lines.length - 1)