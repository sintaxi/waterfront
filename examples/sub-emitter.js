var waterfront = require('../').connect()
var sock       = waterfront.socket('sub-emitter')

sock.on('*', function(channel, data){
  console.log(channel, data)
})