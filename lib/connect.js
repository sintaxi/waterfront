var url     = require('url')
var axon    = require('axon')
var helpers = require('./helpers')
var debug   = require('debug')('waterfront:connect')


module.exports = function(port, host) {
  var port = port || 4100
  var host = host || "localhost"
  
  var ports   = helpers.buildPortList(port)
  var portMap = helpers.buildPortMap(ports)

  return {
    socket: function(type){
      var sock = axon.socket(type)
      
      // build connection map
      var map = {
        "push": 0,
        "pull": 1,
        "req" : 2,
        "rep" : 3,
        "pub" : 4,
        "sub" : 5,
        "pub-emitter": 6,
        "sub-emitter": 7,
      }
      
      // connect to
      debug(type + ' socket connecting...', { port: portMap[type], host: host })
      sock.connect(portMap[type], host)

      if(["pub-emitter", "sub-emitter"].indexOf(type) === -1) {
        sock.format('json')
      }

      return sock
    }
  }
}
