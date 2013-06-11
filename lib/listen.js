var http    = require('http')
var zmq     = require('zmq')
var helpers = require('./helpers')
var debug   = require('debug')('waterfront:listen')

module.exports = function(port, host, callback){

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
      bind: function(fURI, bURI, callback){

        if(!callback){
          callback = new Function()
        }

        /**
         * Bind Backend
         *
         *   We bind the Backend firt so it is ready to dispatch
         *   before messages come in.
         *
         */

        backend.bind(bURI, function(err){
          if(err) return callback(err)

          debug('[' + name + ' bound backend', bURI)

          /**
           * Bind Frontend
           *
           *   Once the backend is done binding we bind the
           *   frontend so it may start receiving messages.
           */

          frontend.bind(fURI, function(err){
            if(err) return callback(err)

            debug('[' + name + ' bound frontend', fURI)
            callback()
          })
        })
      }
    }
  }


  /**
   * xpush/xpull
   */

  var push = zmq.socket('push')
  var pull = zmq.socket('pull')

  pull.on('message', function(msg){
    debug('[xpush/xpull ->]', msg)
    push.send(msg)
  })

  pull.bind(helpers.addr(ports[0], host))
  push.bind(helpers.addr(ports[1], host))


  /**
   * xreq/xrep
   */

  var router     = zmq.socket('router')
  var dealer     = zmq.socket('dealer')
  var router_uri = helpers.addr(ports[2], host)
  var dealer_uri = helpers.addr(ports[3], host)

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

  pair(router, dealer, "router/dealer").bind(router_uri, dealer_uri)


  /**
   * xpub/xsub
   */

  var sub     = zmq.socket('sub')
  var pub     = zmq.socket('pub')
  var sub_uri = helpers.addr(ports[4], host)
  var pub_uri = helpers.addr(ports[5], host)

  sub.subscribe('')

  sub.on('message', function(){
    debug('[xpub/xsub ->]', arguments[0].toString())
    pub.send(Array.prototype.slice.call(arguments))
  })

  pair(sub, pub, "xpub/xsub").bind(sub_uri, pub_uri)


  /**
   * HTTP Monitoring
   */

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
