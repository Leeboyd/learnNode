const net = require('net')
const moment = require('moment')
function getNow () {
    const now = new Date()
    const reformat = moment(now).format("YYYY-MM-DD HH:mm")
    return reformat
}


const server = net.createServer((socket) => {
  socket.end(getNow() + '\n')
})
server.listen(+process.argv[2])