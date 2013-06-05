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
      var sock = zmq.socket(type)

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

      sock.connect(helpers.addr(portMap[type], host))

      if(["push", "pub", "req"].indexOf(type) !== -1) {

        return {
          send: function(msg, cb){
            if(type == "pub"){
              sock.send("WATERFRONT " + JSON.stringify(msg))
            }else{
              if(cb){
                sock.on("message", function(msg){
                  cb(msg)
                })
              }

              sock.send(JSON.stringify(msg))

            }

            //sock.send(JSON.stringify(msg), cb)
          }
        }

      }else{
        var ee = new EventEmitter()

        if(type == "sub"){
          sock.identity = 'SUB:' + process.pid;
          sock.subscribe("WATERFRONT")
        }

        sock.on("message", function(msg){
          var str = msg.toString()

          if(type == "sub"){
            var str = str.replace(/^WATERFRONT\s{1}/, "")
          }

          ee.emit("message", JSON.parse(str))
        })

        return ee
      }

    }
  }
}
