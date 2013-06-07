var http    = require('http')
var zmq     = require('zmq')
var helpers = require('./helpers')
var debug   = require('debug')('waterfront:listen')

module.exports = function(port, host, callback){

  port        = port || 4100
  var ports   = helpers.buildPortList(port)
  var portMap = helpers.buildPortMap(ports)

  // //////////////////
  // // compenent 1
  // // xpush/xpull
  // //////////////////

  var push = zmq.socket('push')
  var pull = zmq.socket('pull')

  pull.on('message', function(msg){
    debug('[pull -> push]', msg)
    push.send(msg)
  })

  // //////////////////
  // // component 2
  // // xreq/xrep
  // //////////////////

  // var req = zmq.socket('req')
  // var rep = zmq.socket('rep')

  // // rep.on('message', function(str, callback){
  // //   debug('[rep -> req]', str)
  // //   req.send(str, function(rsp){
  // //     debug('[rep <- req]')
  // //     callback(rsp)
  // //   })
  // // })

  // rep.on('message', function(msg, cb){
  //   debug('[rep -> req]')
  //   rep.send(msg);
  // })

  var frontend = zmq.socket('router')
  var backend  = zmq.socket('dealer')

  frontend.on('message', function() {
    var args = Array.apply(null, arguments)
    backend.send(args)
  })

  backend.on('message', function() {
    var args = Array.apply(null, arguments)
    frontend.send(args)
  })

  // //////////////////
  // // component 3
  // // xpub/xsub
  // //////////////////

  var pub = zmq.socket('pub')
  var sub = zmq.socket('sub')

  sub.subscribe("WATERFRONT")

  sub.on('message', function(msg){
    debug('[sub -> pub]', msg)
    pub.send(msg)
  })

  pull.bindSync(helpers.addr(ports[0], host))
  push.bindSync(helpers.addr(ports[1], host))
  frontend.bindSync(helpers.addr(ports[2], host))
  backend.bindSync(helpers.addr(ports[3], host))
  sub.bindSync(helpers.addr(ports[4], host))
  pub.bindSync(helpers.addr(ports[5], host))

  // //////////////////
  // // component 4
  // // xpub-emitter/xsub-emitter
  // //////////////////

  // var pubemitter = axon.socket('pub-emitter')
  // var subemitter = axon.socket('sub-emitter')

  // subemitter.bind(ports[6], host)
  // pubemitter.bind(ports[7], host)

  // subemitter.on('*', function(chan, msg){
  //   debug('[sub-em -> pub-em]', chan, msg)
  //   pubemitter.emit(chan, msg)
  // })

  //////////////////
  // component 5
  // simple monitoring
  //////////////////

  http.createServer(function (req, rsp) {

    var str = JSON.stringify({
      pid     : process.pid,
      uptime  : process.uptime(),
      memory  : process.memoryUsage(),
      ports   : portMap
    }, null, 2) + "\n"

    rsp.statusCode = 200
    rsp.setHeader("Content-Type", "application/json")
    rsp.setHeader("Content-Length", str.length)
    rsp.end(str)

  }).listen(port, host, function(){
    callback(portMap)
  })

}
