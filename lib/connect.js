var url     = require('url')
var axon    = require('axon')
var helpers = require('./helpers')


module.exports = function(domain) {
  var domain  = url.parse(domain || "tcp://localhost")
  var port    = domain.port || 4100
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
      
      // build connection url
      var connectionUrl = url.format({
        protocol  : domain.protocol || "tcp://",
        hostname  : domain.hostname,
        port      : portMap[type]
      })
      
      // connect to
      sock.connect(connectionUrl)

      if(["pub-emitter", "sub-emitter"].indexOf(type) === -1) {
        sock.format('json')
      }

      return sock
    }
  }
}
