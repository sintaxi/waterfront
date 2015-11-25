var waterfront = require('../').connect()
var sock       = waterfront.socket('rep')

sock.on('message', function(data, callback){
  console.log("recieved req:", data)
  data.rep = +new Date
  callback(data)
})