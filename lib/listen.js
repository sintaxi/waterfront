var http    = require('http')
var zmq     = require('zmq')
var helpers = require('./helpers')
var debug   = require('debug')('waterfront:listen')

module.exports = function(port, host, callback){

  if(!callback) callback = new Function()

  port        = port || 4100
  var ports   = helpers.buildPortList(port)
  var portMap = helpers.buildPortMap(ports)

  /**
   * Pair
   *
   * Provides a closure for binding the sockets.
   *
   *   pair(frontend, backend, name).bind(fURI, bURI, function(){
   *
   *   })
   */

  var pair = function(frontend, backend, name){

    return {

      bind: function(fURI, bURI, cb){
        if(!cb) cb = new Function()

        /**
         * Bind Backend
         *
         *   We bind the Backend firt so it is ready to dispatch
         *   before messages come in.
         *
         */

        backend.bind(bURI, function(err){
          if(err) return cb(err)

          debug('[' + name + ' bound backend', bURI)

          /**
           * Bind Frontend
           *
           *   Once the backend is done binding we bind the
           *   frontend so it may start receiving messages.
           */

          frontend.bind(fURI, function(err){
            if(err) return cb(err)

            debug('[' + name + ' bound frontend', fURI)
            cb()
          })
        })
      }
    }
  }


  /**
   * xpush/xpull
   */

  var pull     = zmq.socket('pull')
  var push     = zmq.socket('push')
  var pull_uri = helpers.addr(ports[0], host)
  var push_uri = helpers.addr(ports[1], host)

  pull.on('message', function(msg){
    debug('[xpush/xpull ->]', msg.toString())
    push.send(msg)
  })


  /**
   * xreq/xrep
   */

  var router     = zmq.socket('router')
  var dealer     = zmq.socket('dealer')
  var router_uri = helpers.addr(ports[2], host)
  var dealer_uri = helpers.addr(ports[3], host)

  //router.setsockopt(zmq.ZMQ_ROUTER_MANDATORY, 1)

  router.on('message', function() {
    debug('[router/dealer ->]')
    var args = Array.apply(null, arguments)
    dealer.send(args)
  })

  dealer.on('message', function() {
    debug('[router/dealer <-]')
    var args = Array.apply(null, arguments)
    router.send(args)
  })

  /**
   * xpub/xsub
   */

  var sub     = zmq.socket('sub')
  var pub     = zmq.socket('pub')
  var sub_uri = helpers.addr(ports[4], host)
  var pub_uri = helpers.addr(ports[5], host)

  sub.subscribe('')

  sub.on('message', function(msg){
    debug('[xpub/xsub ->]')
    pub.send(msg)
  })


  /**
   * HTTP Monitoring
   */

  var health = http.createServer(function (req, rsp) {

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

  })

  /**
   * Flush Queues messages present worker reconnects
   */

  setInterval(function(){

    if(dealer._outgoing.length !== 0){
      debug('[router/dealer flush]', dealer._outgoing.length)
      dealer._flush()
    }

    if(push._outgoing.length !== 0){
      debug('[push/pull flush]', push._outgoing.length)
      push._flush()
    }

  }, 500)


  /**
   * Startup
   */

  var total = 4;
  var count = 0

  var done = function(){
    count ++
    if(count == total) callback(portMap)
  }

  pair(pull, push, "push/pull").bind(pull_uri, push_uri, done)
  pair(router, dealer, "router/dealer").bind(router_uri, dealer_uri, done)
  pair(sub, pub, "xpub/xsub").bind(sub_uri, pub_uri, done)
  health.listen(port, host, done)

}
