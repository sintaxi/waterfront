var http    = require('http')
var zmq     = require('zmq')
var helpers = require('./helpers')
var debug   = require('debug')('waterfront:listen')

module.exports = function(port, host, callback){

  port        = port || 4100
  var ports   = helpers.buildPortList(port)
  var portMap = helpers.buildPortMap(ports)

  //////////////////
  // compenent 1
  // xpush/xpull
  //////////////////

  var push = zmq.socket('push')
  var pull = zmq.socket('pull')

  pull.on('message', function(msg){
    debug('[xpush/xpull ->]', msg)
    push.send(msg)
  })

  pull.bindSync(helpers.addr(ports[0], host))
  push.bindSync(helpers.addr(ports[1], host))

  //////////////////
  // component 2
  // xreq/xrep
  //////////////////

  var reqrep_frontend     = zmq.socket('router')
  var reqrep_backend      = zmq.socket('dealer')
  var reqrep_frontend_uri = helpers.addr(ports[2], host)
  var reqrep_backend_uri  = helpers.addr(ports[3], host)

  reqrep_backend.on('message', function() {
    debug('[router/dealer <-]')
    var args = Array.apply(null, arguments)
    reqrep_frontend.send(args)
  }).bind(reqrep_backend_uri, function(){
    debug('[router/dealer bound backend]', reqrep_backend_uri)
    reqrep_frontend.on('message', function() {
      debug('[router/dealer ->]')
      var args = Array.apply(null, arguments)
      reqrep_backend.send(args)
    }).bind(reqrep_frontend_uri, function(){
      debug('[router/dealer bound fontend]', reqrep_frontend_uri)
    })
  })

  //////////////////
  // component 3
  // xpub/xsub
  //////////////////

  var pubsub_frontend     = zmq.socket('sub')
  var pubsub_backend      = zmq.socket('pub')
  var pubsub_frontend_uri = helpers.addr(ports[4], host)
  var pubsub_backend_uri  = helpers.addr(ports[5], host)

  pubsub_backend.bind(pubsub_backend_uri, function(){
    debug('[xpub/xsub bound backend', pubsub_backend_uri)
    pubsub_frontend.subscribe('').on('message', function(){
      debug('[xpub/xsub ->]', arguments[0].toString())
      pubsub_backend.send(Array.prototype.slice.call(arguments))
    }).bind(pubsub_frontend_uri, function(){
      debug('[xpub/xsub bound fontend', pubsub_frontend_uri)
    })
  })

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
  // http monitoring
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
