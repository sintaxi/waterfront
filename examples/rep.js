var waterfront = require('../').connect()
var sock       = waterfront.socket('rep')

sock.on('message', function(data, callback){
  data.rep = +new Date
  callback(data)
})