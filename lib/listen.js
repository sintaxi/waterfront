var axon    = require('axon')
var helpers = require('./helpers')

module.exports = function(port, host){

  ports = helpers.genPortList(port)

  //////////////////
  // compenent 1
  // xpush/xpull
  //////////////////

  var push = axon.socket('push')
  var pull = axon.socket('pull')

  pull.bind(ports[0], host)
  push.bind(ports[1], host)

  push.format("json")
  pull.format("json")

  pull.on('message', function(msg){
    push.send(msg)
  })

  //////////////////
  // component 2
  // xreq/xrep
  //////////////////

  var req = axon.socket('req')
  var rep = axon.socket('rep')

  rep.bind(ports[2], host)
  req.bind(ports[3], host)

  req.format('json')
  rep.format('json')

  rep.on('message', function(str, callback){
    req.send(str, function(rsp){
      callback(rsp)
    })
  })

  //////////////////
  // component 3
  // xpub/xsub
  //////////////////

  var pub = axon.socket('pub')
  var sub = axon.socket('sub')

  sub.bind(ports[4], host)
  pub.bind(ports[5], host)

  sub.format('json')
  pub.format('json')

  sub.on('message', function(msg){
    pub.send(msg)
  })

  //////////////////
  // component 4
  // xpub-emitter/xsub-emitter
  //////////////////

  var pubemitter = axon.socket('pub-emitter')
  var subemitter = axon.socket('sub-emitter')

  subemitter.bind(ports[6], host)
  pubemitter.bind(ports[7], host)

  subemitter.on('*', function(chan, msg){
    pubemitter.emit(chan, msg)
  })

}
