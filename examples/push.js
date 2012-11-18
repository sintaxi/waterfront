var waterfront = require('../').connect()
var sock       = waterfront.socket('push')

setInterval(function(){
  process.stdout.write('.')
  sock.send({ "date" : (+new Date) })
}, 200)
