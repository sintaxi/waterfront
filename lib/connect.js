var url     = require('url')
var zmq     = require('zmq')
var helpers = require('./helpers')
var debug   = require('debug')('waterfront:connect')
var EventEmitter = require('events').EventEmitter


module.exports = function(port, host) {
  var port = port || 4100
  var host = host || "localhost"

  var ports   = helpers.buildPortList(port)
  var portMap = helpers.buildPortMap(ports)

  return {
    socket: function(type){

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
      debug(type + ' socket connecting to: ', helpers.addr(portMap[type], host))

      switch(type){

      case "pub":
        var sock = zmq.socket(type)
        sock.connect(helpers.addr(portMap[type], host))
        sock.identity = type + process.pid

        return {
          send: function(chan, msg){
            if(!msg){
              msg   = chan
              chan  = "message"
            }
            msg   = JSON.stringify(msg)
            sock.send([chan, msg].join(" "))
          }
        }
      break;

      case "sub":
        var sock = zmq.socket(type)
        sock.connect(helpers.addr(portMap[type], host))
        sock.identity = type + process.pid
        sock.subscribe("message")
        var ee = new EventEmitter()
        sock.on("message", function(msg){
          var str = msg.toString()
          var str = str.replace(/^message\s{1}/, "")
          ee.emit("message", JSON.parse(str))
        })
        return ee
      break;

      case "push":
        var sock = zmq.socket(type)
        sock.connect(helpers.addr(portMap[type], host))
        sock.identity = type + process.pid
        return {
          send: function(msg){
            sock.send(JSON.stringify(msg))
          }
        }
      break;

      case "pull":
        var sock = zmq.socket(type)
        sock.connect(helpers.addr(portMap[type], host))
        sock.identity = type + process.pid
        var ee = new EventEmitter()
        sock.on("message", function(msg){
          var str = msg.toString()
          ee.emit("message", JSON.parse(str))
        })
        return ee
      break;

      case "req":
        return {
          send: function(msg, cb){
            var sock = zmq.socket(type)
            sock.connect(helpers.addr(portMap[type], host))
            sock.identity = type + process.pid
            sock.once('message', function(msg){
              cb(JSON.parse(msg))
            })
            sock.send(JSON.stringify(msg))
          }
        }
      break;

      case "rep":
        var sock = zmq.socket(type)
        sock.connect(helpers.addr(portMap[type], host))
        sock.identity = type + process.pid

        var ee = new EventEmitter()

        sock.on('message', function(msg) {
          ee.emit("message", JSON.parse(msg), function(data){
            sock.send(JSON.stringify(data))
          })
        })

        return ee
      break;

      default:
        console.log(type, "not supported.")
      }

    }
  }
}
