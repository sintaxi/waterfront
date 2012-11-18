var waterfront = require('../').connect()
var sock       = waterfront.socket('pub-emitter')

setInterval(function(){
  process.stdout.write('.')
  sock.emit( "vancouver", { "date": (+new Date) })
}, 500)