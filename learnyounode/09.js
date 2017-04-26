const http = require('http')
const bl = require('bl')
const results = []
let counter = 0

function getData (index) {
    http.get(process.argv[2 + index], (res) => {
        res.pipe(bl((err, data) => {
            if (err) {
                return console.error(err)
            }
            results[index] = data.toString()
            counter++
            
            if (counter === 3) {
                results.forEach((data) => console.log(data))
            }
        }))
    });
}


for (let index = 0; index < 3; index++) {
    getData(index)
}